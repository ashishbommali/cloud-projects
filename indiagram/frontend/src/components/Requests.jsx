import { getFriendRequests, respondFriendRequest } from '../api/users';
import AuthContext from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import AVATAR from '../assets/img/avatar.png';

const Requests = () => {
  const {id} =useContext(AuthContext);
  const [requests, setRequests] =useState([]);
  useEffect(() =>{
    (async () =>{
      try {
        const {data, status} =await getFriendRequests({id});
        if(status ==200) setRequests(data);
        else console.log(data);
      } catch ({message}) {
        console.log(message);
      }
    })();
  }, []);
   const handleRequest =async details =>{
    try {
      const {status, data} =await respondFriendRequest(details);
      if(status ==200) setRequests([...requests].filter(({request_id})=>request_id !=details.request_id));
      alert(data?.message || data);
    } catch ({message}) {
      alert(message);
    }
   } 
  return (
    <div className='pt-5 flex flex-col gap-4 h-full overflow-hidden'>
      {requests.length? requests.map(({name, request_id, profile_photo}) =>(
        <div className="flex justify-between items-center bg-gray-50 shadow-sm py-3 px-5 rounded text-[#555]" key={request_id}>
          <div className="">
            <img src={profile_photo || AVATAR} alt="name" className='h-6 w-6'/>
            <p>{name}</p>
          </div>
          <div className="flex justify-end gap-5">
            <button className='text-white bg-purple-500 px-5 py-1 rounded text-sm' onClick={() =>handleRequest({status: 'accepted', request_id, user: id})}>Accept</button>
            <button className='text-white bg-red-500 px-5 py-1 rounded text-sm' onClick={() =>handleRequest({status: 'rejected', request_id, user: id})}>Decline</button>
          </div>
        </div>
      )): <div className='p-12 flex justify-center text-[#777] h-full text-sm'>You have no friend requests</div>} 
    </div>
  )
}

export default Requests