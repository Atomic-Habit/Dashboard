import React from 'react';
import { auth } from '../utils/firebase';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

const ArticleCard = (props) => (
  <div  className='overflow-hidden  bg-[#000] min-w-[300px] duration-500 hover:drop-shadow-3xl transition-all min-h-[350px] max-h-[360px] rounded-[20px]'>
    <Link to={'/article/' + props.id} className="article-card relative overflow-hidden min-w-[300px] min-h-[350px] max-h-[350px] rounded-[20px]">
      <div className="w-full h-full" 
      style={{
        backgroundImage: props.image ? 'url('+props.image+')' : "url(https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80)",
        backgroundSize: "cover", 
        backgroundPosition: "center"
        }}></div>
      <div className=" gradient text-[#fff] w-[300px]  p-5 absolute z-10 bottom-0">
        <h3 className='font-black text-[20px]'>{props.title}</h3>
        <p className='font-regular text-[12px]'>{props.description}</p>
      </div>
    </Link>
  </div>
)

const CustomSkeletone = () => (
  <div className="custom-skeletone overflow-hidden min-w-[300px] min-h-[350px] rounded-[20px]">
    <Skeleton animation="wave" width={300} height={220} style={{ borderRadius: 0, transform: "scale(1)" }} className="skeletone" />
    <div className=" bg-[#000] w-[300px] h-full p-5">
      <Skeleton sx={{ bgcolor: 'grey.700' }} width={250} height={30} variant="h1" style={{ borderRadius: 5, transform: "scale(1)" }} className="" />
      <Skeleton sx={{ bgcolor: 'grey.700' }} width={250} variant="text" className="mt-[10px]" />
      <Skeleton sx={{ bgcolor: 'grey.700' }} width={250} variant="text"  />
    </div>
  </div>
)

const Home = (props) => {

  return (
    <section id='home' className="p-40 relative">
      <h1 className='text-3xl font-black'>Bonjour {auth.currentUser && auth.currentUser.displayName} 👋,</h1>
      <div className="py-20 flex flex-wrap articles-container absolute -translate-x-1/2 left-1/2 w-full max-w-[1400] px-40 mx-auto">

        <Link to={'/create'} className="w-[300px] h-[360px] block border border-accent border-[2px] rounded-[20px] relative create-article">
          <div className="h-[5px] bg-accent w-[50px] rounded-full absolute top-1/2 left-1/2 -translate-y-1/2  -translate-x-1/2"></div>
          <div className="h-[5px] more bg-accent w-[50px] rounded-full rotate-90 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
        </Link>

        {
          props.loadingArticles ?
          <>
            <CustomSkeletone />
            <CustomSkeletone />
            <CustomSkeletone />
            <CustomSkeletone />
            <CustomSkeletone />
            <CustomSkeletone />
          </>
          :
          props.articles.map((article, key) => <ArticleCard title={article.title} id={article.id} image={article.image} description={article.description} key={key} />)
        }

      </div>
    </section>
  )
}

export default Home