import { EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signOut } from 'next-auth/react';
import { useRef, useState } from "react";
import { db, storage } from '../firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc  } from "firebase/firestore";
import { getDownloadURL, uploadString, ref } from "firebase/storage";

export default function Input() {
    const {data: session} = useSession();
    const [input, setInput] = useState('');
    const [slectedFile, SetSlectedFile] = useState();
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null)

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            id: session.user.uid,
            text: input,
            user_session: session.user,
            timestamp: serverTimestamp(),
        });
        const imageRef = ref(storage, `posts/${docRef.id}/images`);
        if (slectedFile) {
            await uploadString(imageRef, slectedFile, 'data_url').then(async() => {
                const downloadURL = await getDownloadURL(imageRef);
                console.log(downloadURL);
                await updateDoc(doc(db, 'posts', docRef.id), {
                    image: downloadURL,

                })
            })
        }
        setInput('');
        SetSlectedFile(null);
        setLoading(false);
    };

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }
        reader.onload = (readerEvent) => {
            SetSlectedFile(readerEvent.target.result)
        }
    };
  return (
    <>
    {session && (
            <div className='flex border-b border-gray-200 p-3 space-x-3'>
            <img 
                onClick={signOut}
                src={session.user.image}
                alt="user-img"
                className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
            />
            <div className='w-full divide-y divide-gray-200'>
                <div className=''>
                    <textarea 
                        className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                        rows='2' 
                        placeholder="What`s happening?"
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}>
                    </textarea>
                </div>
                {slectedFile && (
                    <div className="relative">
                        <XIcon onClick={() => SetSlectedFile(null)} className="h-7 text-black absolute cursor-pointer rounded-full shadow-md"/>
                        <img 
                            src={slectedFile}
                            className={`${loading && 'animate-pulse'}`}
                        />
                    </div>
                )}
                <div className='flex items-center justify-between pt-2'>
                    {!loading && (
                    <>
                    <div className='flex'>
                        <div className="" onClick={() => filePickerRef.current.click()}>
                            <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                            <input 
                                onChange={addImageToPost} 
                                type='file' 
                                hidden
                                ref={filePickerRef} />
                        </div>
                        <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                    </div>
                    <button 
                        className="bg-blue-400 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                        onClick={sendPost}
                        disabled={!input.trim()}
                    >Tweet</button>
                    </>
                    )}
                </div>
            </div>
        </div>
    )}
    </>
  )
}
