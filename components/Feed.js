import { SparklesIcon } from "@heroicons/react/outline";
import Input from "./Input";
import Post from "./Post";


export default function Feed() {
    const posts = [
        {
            id: '1',
            name: 'Shani govel',
            username: 'itsShany',
            userImg: 'https://pbs.twimg.com/profile_images/1490533817416925189/oDKK6UFj_400x400.jpg',
            img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            text: 'nice view!',
            timestamp: '2 hours ago'
        },
        {
            id: '2',
            name: 'Shani govel',
            username: 'itsShany',
            userImg: 'https://pbs.twimg.com/profile_images/1490533817416925189/oDKK6UFj_400x400.jpg',
            img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fG5hdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            text: 'from my window view',
            timestamp: '4 days ago'
        },
    ]
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
            <div className='hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9'>
                <SparklesIcon className='h-5' />
            </div>
        </div>
        <Input />
        {posts.map((post) => (
            <Post key={post.id} post={post}/>
        ))}
    </div>
  )
}
