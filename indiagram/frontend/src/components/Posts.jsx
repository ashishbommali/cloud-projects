import AVATAR from '../assets/img/avatar.png';
import AuthContext from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { commentPost, fetchPostComments, fetchPosts, reactToPost } from '../api/posts';

const Posts = () => {
  const [posts, setPosts] =useState([]);
  const [postComments, setPostComments] =useState([]);
  const currentUser =useContext(AuthContext);
  const [comment, setComment] =useState({body: null, user: currentUser.id, post: null});

  const fetch_posts =async() =>{
    try {
      const {status, data} =await fetchPosts(currentUser.id);
      if(status ==200) setPosts(data);
      else console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() =>{
    (async () =>{
      await fetch_posts();
    })();
  }, []);

  const handleComment =async ()=>{
    if([...Object.keys(comment)].filter(key =>comment[key] !=null).length >=3){
      const {status} =await commentPost(comment);
      if(status ==201) await fetch_posts();
      document.getElementById('comment-box').value ='';
    }
  };

  const togglePostLike =async post=>{
    try {
      const {status} =await reactToPost({post, user: currentUser.id});
      if(status ==201) await fetch_posts();
    } catch ({messgae}) {
      console.log(messgae);
    }
  }

  const fetchComments =async post=>{
    try {
      const {status, data} =await fetchPostComments(post);
      if(status ==200) setPostComments(data);
      [...document.querySelectorAll('.comments')].forEach(doc =>doc.id ==post? doc.classList.toggle('hidden'): doc.classList.add('hidden'))
    } catch ({messgae}) {
      console.log(messgae);
    }
  }

  return (
    <div className='flex flex-col gap-4 h-full overflow-hidden'>
      {posts.length? posts.map(({id, body, author_name, author_image, posted_at, userLiked, userCommented, attatchment, likes, comments}) =>(
        <div className="grid grid-rows-[auto_max-content] gap-5" key={id}>
            <div className=" bg-gray-50 py-3 px-5 rounded text-[#555]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200"><img src={author_image || AVATAR} alt={author_name} className='block w-full h-full'/></div>
                    <div className="">
                        <h2 className='font-bold leading-3'>{author_name}</h2>

                        <p className='text-sm'>{posted_at}</p>
                    </div>
                </div>
                <div className="pt-4">
                    {attatchment &&(<img src={attatchment} alt ={body?.slice(0, 10)} className='h-48 w-full object-cover object-left-top bg-gray-300 rounded'/>)}
                    <p className='py-5'>{body}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() =>togglePostLike(id)} className={`${userLiked? 'text-blue-500': ''}`}>{likes}<FontAwesomeIcon icon={faThumbsUp}/></button>
                        <button onClick={() =>fetchComments(id)} className={`${userCommented? 'text-blue-500': ''}`}>{comments}<FontAwesomeIcon icon={faComment}/></button>
                    </div>
                    <div className={`overflow-auto comments`} id ={id}>
                    {postComments.length? (<div className='flex flex-col gap-2 py-5'>
                        {postComments.map(({author, body}, index) =>(<div key={index} className='py-2 bg-gray-100 rounded px-4'>
                          <h3 className='font-bold'>{author}</h3>
                          <p>{body}</p>
                        </div>))}
                  </div>): null}
                </div>
                </div>
                
                <div className="grid grid-cols-[auto_max-content] mt-3 overflow-hidden rounded">
                    <input id='comment-box' className='block outline-none bottom-0 bg-transparent border-[1px] border-gray-300 py-2 px-5' placeholder='comment' onChange={event =>setComment({...comment, body: event.target.value, post: id})}/>
                    <button className='block bg-blue-500 text-white px-5 py-2' onClick={handleComment}>Post</button>
                </div>
            </div>
        </div>
      )): (<div className='p-12 flex items-center justify-center text-[#777] h-full text-sm'>No feeds posted yet</div>)}
    </div> 
  )
}

export default Posts;