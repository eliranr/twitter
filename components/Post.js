import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline";
import Moment from 'react-moment';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from "react";
import { HeartIcon as HeartIconFill } from '@heroicons/react/solid';
import { deleteObject, ref } from "firebase/storage";

export default function Post({post}) {
    const { data: session } = useSession();
    const isOuner = post.data().id == session?.user.uid;
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'posts', post.id, 'likes'), (snapshot) => setLikes(snapshot.docs)
        )
    }, [db]);
    useEffect(() => {
        setHasLiked(likes.findIndex((like)=>like.id === session?.user.uid) !== -1)
    }, [likes]);

    async function likePost() {
        if (session) {
            if (hasLiked) {
                await deleteDoc(doc(db, 'posts', post.id, 'likes', session?.user.uid));
            } else {
                await setDoc(doc(db, 'posts', post.id, 'likes', session?.user.uid), {
                    username: session.user.username
                });
            }
        } else {
            signIn();
        }
    };

    async function delPost() {
        if (window.confirm('Are ypu sure yuo want to delete this post?')) {
            await deleteDoc(doc(db, 'posts', post.id));
            if (post.data().image) {
                deleteObject(ref(storage, `posts/${post.id}/image`));
            }
        }
    }
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
        {/* image */}
        <img 
            className="h-11 w-11 rounded-full mr-4"
            src={post.data().user_session.image}
            alt='user-img'
        />
        <div className='w-full'> {/* right side */}
            <div className="flex items-center justify-between"> {/* Hedear */}
                <div className="flex items-center space-x-1 whitespace-nowrap"> {/* post user info */}
                    <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{post.data().user_session.name}</h4>
                    <span className='text-sm sm:text-[15px]'>@{post.data().user_session.username} -</span>
                    <span className='text-sm sm:text-[15px] hover:underline'>
                        <Moment fromNow>
                            {post?.data().timestamp?.toDate()}
                        </Moment>
                    </span>
                </div>
                <DotsHorizontalIcon className="h-10 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100 ml-auto"/> {/* dots icon */}
            </div>
            <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2"> {/* post text */}
                {post.data().text}
            </p>
            <img className="rounded-2xl mr-2" src={post.data().image} alt="" />  

            <div className="flex justify-center justify-between text-gray-500 p-2"> {/* Icons */}
                <ChatIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"/>
                {isOuner && 
                    <TrashIcon onClick={delPost} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
                }
                <div className="flex items-center">
                    {hasLiked 
                    ?   <HeartIconFill onClick={likePost} className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"/>
                    :   <HeartIcon onClick={likePost} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
                    }
                    {
                        likes.length > 0 && (
                            <span className={`${hasLiked && 'text-red-600'} text-sm`}>{likes.length}</span>
                        )
                    }
                </div>
                <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"/>
                <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"/>
            </div>
        </div>
    </div>
  )
}
