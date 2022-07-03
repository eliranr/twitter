import {useRecoilState} from 'recoil';
import {modalState, postIdState} from '../atom/modalAtom';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { onSnapshot, doc, setDoc, addDoc, serverTimestamp, collection, query } from 'firebase/firestore';
import Moment from 'react-moment';
import { useSession, signOut, signIn } from 'next-auth/react';
import { EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline";
import { async } from '@firebase/util';
import {useRouter} from 'next/router';


export default function CommentModal() {
    const [post, setPost] = useState({});
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const { data: session } = useSession();
    const [inputComment, setInputComment] = useState('');
    const [listComments, setListComments] = useState([]);
    const router = useRouter();

    useEffect(() => {
        onSnapshot(
            doc(db, 'posts', postId), (snapshot) => {
                //console.log(snapshot.data());
                setPost(snapshot);
            }
        )
    }, [postId, db]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'posts', postId, 'comments')), (snapshot) => {
                console.log(snapshot.docs);
                setListComments(snapshot.docs);
            }
        )
    }, [db]);

    const sendComment = async () => {
        await addDoc(collection(db, 'posts', postId, 'comments'), {
            text: inputComment,
            user_session: session.user,
            timestamp: serverTimestamp(),
        });
        setInputComment('');
        setOpen(false);
        router.push(`/posts/${postId}`);
    }
  return (
    <div>
        {open && (
            <Modal 
                ariaHideApp={false}
                isOpen={open} 
                onRequestClose={() => setOpen(false)}
                className='max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md'>
                <div className='p-1'>
                    <div className='border-b border-gray-200 py-2 px-1.5'>
                        <div onClick={() => setOpen(false)} className='hoverEffect w-9 h-9 flex items-center justify-center'>
                            <XIcon className='h-[23px] text-gray-700'/>
                        </div>
                    </div>
                    <div className='p-2 flex items-center space-x-1 relative'>
                        <span className='w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300'/>
                        <img 
                            className="h-11 w-11 rounded-full mr-40 "
                            src={post?.data()?.user_session.image}
                            alt='user-img'
                        />
                        <div className='flex items-center space-x-1 pl-2'>
                            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{post?.data()?.user_session.name}</h4>
                            <span className='text-sm sm:text-[15px]'> @{post?.data()?.user_session.username} -</span>
                            <span className='text-sm sm:text-[15px] hover:underline'>
                                <Moment fromNow>
                                    {post?.data()?.timestamp?.toDate()}
                                </Moment>
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2  "> {/* post text */}
                        {post?.data()?.text}
                    </p>
                    <div>
                    {listComments.map((commentItem) => {
                        console.log(commentItem?.data()); ///////////////////// פה הפסקת!
                        return (<h1 key={commentItem?.data()?.text}>{commentItem?.data()?.text}</h1>)
                    })}
                    </div>
                    {/*  Input  */}
                    {session ? (
                        <div className='flex border-gray-200 p-3 space-x-3'>
                        <img 
                            src={session.user.image}
                            alt="user-img"
                            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
                        />
                        <div className='w-full divide-y divide-gray-200'>
                            <div className=''>
                                <textarea 
                                    className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                                    rows='2' 
                                    placeholder='Tweet Your reply'
                                    value={inputComment}
                                    onChange={(e)=>setInputComment(e.target.value)}>
                                </textarea>
                            </div>
                            {/* {slectedFile && (
                                <div className="relative">
                                    <XIcon onClick={() => SetSlectedFile(null)} className="h-7 text-black absolute cursor-pointer rounded-full shadow-md"/>
                                    <img 
                                        src={slectedFile}
                                        className={`${loading && 'animate-pulse'}`}
                                    />
                                </div>
                            )} */}
                            <div className='flex items-center justify-between pt-2'>
                                <div className='flex'>
                                    <div
                                        className="" 
                                        // onClick={() => filePickerRef.current.click()}
                                    >
                                        <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                        {/* <input 
                                            onChange={addImageToPost} 
                                            type='file' 
                                            hidden
                                            ref={filePickerRef} /> */}
                                    </div>
                                    <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                </div>
                                <button 
                                    className="bg-blue-400 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                                    onClick={sendComment}
                                    disabled={!inputComment.trim()}
                                >Reply</button>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <div className='flex p-2'>
                            <button 
                                className="ml-auto bg-red-400 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:brightness-95"
                                onClick={signIn}
                            >Sign In</button>
                        </div>
                    )}
                    
                </div>
            </Modal>
        )}
    </div>
  )
}
