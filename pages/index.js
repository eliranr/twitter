import Head from 'next/head'
import Feed from '../components/Feed'
import Sidebar from '../components/Sidebar'
import Widgets from '../components/Widgets'

export default function Home({newResults}) {
  return (
    <div>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex min-h-screen mx-auto'>
        <Sidebar />
        <Feed />
        <Widgets newResults={newResults.articles} />
      </main>
    </div>
  )
}



export async function getServerSideProps() {
  const newResults = await fetch(
    'https://saurav.tech/NewsAPI/top-headlines/category/business/in.json'
  ).then((res=>res.json()));
  return {
    props: {
      newResults,
    }
  }
}