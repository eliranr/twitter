import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline";
import Moment from 'react-moment';

export default function Post({post}) {
    console.log(post.data().timestamp)
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
                <TrashIcon className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
                <HeartIcon className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
                <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"/>
                <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"/>
            </div>
        </div>
    </div>
  )
}
