import { getUsers, sendFriendRequest } from '../api/users';
import AuthContext from '../context/AuthContext';
import AVATAR from '../assets/img/avatar.png';
import { useContext, useEffect, useState } from "react";

const People = () => {
  const currentUser =useContext(AuthContext);
  const [users, setUsers] =useState([]);
  useEffect(() =>{
    (async () =>{
      try {
        const {data, status} =await getUsers(currentUser.id);
        if(status ==200) setUsers(data);
        else console.log(data);
      } catch ({message}) {
        console.log(message);
      }
    })();
  }, []);
  const sendRequest = async ({by, to})=>{
    try {
      const {status, data} =await sendFriendRequest({by, to});
      if(status ==201) setUsers(users.filter(({id}) =>id !=to));
      alert(data?.message);
    } catch ({message}) {
      console.log(message);
    }
  }
  return (
    <div className='pt-5 flex flex-col gap-4 h-full'>
      {users.length? users.map(({name, id, profile_photo}) =>(
        <div className="flex justify-between items-center bg-gray-50 shadow-sm py-3 px-5 rounded text-[#555]" key={id}>
          <div className="">
            <img src={profile_photo || AVATAR} alt="name" className='h-6 w-6'/>
            <p>{name}</p>
          </div>
          <div className="flex justify-end gap-5">
            <button className='text-white bg-green-700 px-5 py-2 rounded text-sm' onClick={() =>sendRequest({by: currentUser.id, to: id})}>Friend Request</button>
            <button className='text-white bg-blue-700 px-5 py-2 rounded text-sm'>Message</button>
          </div>
        </div>
      )): (<div className='p-12 flex justify-center text-[#777] h-full text-sm'>No one you may know has been listed</div>)}
    </div>
  )
}

export default People;