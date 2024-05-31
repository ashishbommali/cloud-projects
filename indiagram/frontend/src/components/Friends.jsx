import AVATAR from '../assets/img/avatar.png';
import AuthContext from '../context/AuthContext';
import { useContext, useEffect, useState } from "react";
import { getFriends, unFriendUser } from '../api/users';

const Friends = () => {
  const currentUser =useContext(AuthContext);
  const [friends, setFriends] =useState([]);
  useEffect(() =>{
    (async () =>{
      try {
        const {data, status} =await getFriends(currentUser.id);
        if(status ==200) setFriends(data);
        else console.log(data);
      } catch ({message}) {
        console.log(message);
      }
    })();
  }, []);

  const handleUnfriendRequest = async details=>{
    try {
      const {status, data} =await unFriendUser(details);
      if(status ==200) setFriends([...friends].filter(({friendship_id}) =>friendship_id !=details.id));
      alert(data?.message);
    } catch ({message}) {
      alert(message);
    }
  }
  return (
    <div className='pt-5 flex flex-col gap-4 h-full'>
      {friends.length? friends.map(({name, id, friendship_id, profile_photo}) =>(
        <div className="flex justify-between items-center bg-gray-50 shadow-sm py-3 px-5 rounded text-[#555]" key={id}>
          <div className="">
            <img src={profile_photo || AVATAR} alt="name" className='h-6 w-6'/>
            <p>{name}</p>
          </div>
          <div className="flex justify-end gap-5">
            <button className='text-white bg-blue-700 px-5 py-2 rounded text-sm'>Message</button>
            <button className='text-white bg-red-700 px-5 py-2 rounded text-sm' onClick={() =>handleUnfriendRequest({id: friendship_id, name})}>Unfriend</button>
          </div>
        </div>
      )): (<div className='p-12 flex justify-center text-[#777] h-full text-sm'>All your friends will be listed here</div>)}
    </div>
  )
}

export default Friends;