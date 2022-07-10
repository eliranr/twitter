import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline";
import Moment from 'react-moment';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from "react";
import { HeartIcon as HeartIconFill } from '@heroicons/react/solid';

import {useRecoilState} from 'recoil';
import {modalState, postIdState} from '../atom/modalAtom';
import {useRouter} from 'next/router';

export default function Comment({comment, commentId, orginalPostId}) {
    const { data: session } = useSession();

    const isOuner = comment?.data().user_session.uid == session?.user.uid;
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'posts', orginalPostId, 'comments', commentId, 'likes'), (snapshot) => setLikes(snapshot.docs)
        )
    }, [db, orginalPostId, commentId]);
    useEffect(() => {
        setHasLiked(likes.findIndex((like)=>like.id === session?.user.uid) !== -1)
    }, [likes]);

    async function likeComment() {
        if (session) {
            if (hasLiked) {
                await deleteDoc(doc(db, 'posts', orginalPostId, 'comments', commentId, 'likes', session?.user.uid));
            } else {
                await setDoc(doc(db, 'posts', orginalPostId, 'comments', commentId, 'likes', session?.user.uid), {
                    username: session.user.username
                });
            }
        } else {
            signIn();
        }
    };

    async function delComment() {
        if (window.confirm('Are you sure you want to delete this comments?')) {
            await deleteDoc(doc(db, 'posts', orginalPostId, 'comments', commentId));
        }
    }
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
        {/* image */}
        <img 
            className="h-11 w-11 rounded-full mr-4"
            src={comment?.data()?.user_session.image}
            alt='user-img'
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/man.png";
            }}
        />
        <div className='w-full'> {/* right side */}
            <div className="flex items-center justify-between"> {/* Hedear */}
                <div className="flex items-center space-x-1 whitespace-nowrap"> {/* post user info */}
                    <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{comment?.data()?.user_session.name}</h4>
                    <span className='text-sm sm:text-[15px]'>@{comment?.data()?.user_session.username} -</span>
                    <span className='text-sm sm:text-[15px] hover:underline'>
                        <Moment fromNow>
                            {comment?.data()?.timestamp?.toDate()}
                        </Moment>
                    </span>
                </div>
                <DotsHorizontalIcon className="h-10 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100 ml-auto"/> {/* dots icon */}
            </div>
            <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2 w-full truncate"> {/* post text */}
                {comment?.data()?.text}
            </p>
            <div className="flex justify-center justify-between text-gray-500 p-2"> {/* Icons */}
            <div className="flex items-center select-none">
                <ChatIcon 
                    onClick={()=> {
                        setPostId(orginalPostId);
                        setOpen(!open);
                    }} 
                    className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
                />
            </div>
                
                {isOuner && 
                    <TrashIcon onClick={delComment} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
                }
                <div className="flex items-center">
                    {hasLiked 
                    ?   <HeartIconFill onClick={likeComment} className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"/>
                    :   <HeartIcon onClick={likeComment} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
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
