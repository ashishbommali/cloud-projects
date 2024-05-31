import { Helmet } from 'react-helmet';
import { uploadPost } from '../../api/posts';
import { useContext, useState } from 'react';
import AVATAR from '../../assets/img/avatar.png';
import { fileUpload } from '../../api/file-upload';
import AuthContext from '../../context/AuthContext';
import { Friends, Messages, Modal, Notifications, People, Posts, Requests } from '../../components';
import { updateBio, updateProfileImage } from '../../api/users';

const Dashboard = () => {
  const [showPostForm, setShowPostForm] =useState(false);
  const [showProfile, setShowProfile] =useState(false);
  const [post, setPost] =useState({body: null, file: null});
  const TABS ={ PEOPLE: 'people', MESSAGES: 'messages', REQUESTS: 'requests', NOTIFICATIONS: 'notifications', FRIENDS: 'friends'}
  const {name, id, imageURL, email, setImageURL, setName, setEmail} =useContext(AuthContext);
  const [currentTab, setCurrentTab] =useState(TABS.PEOPLE);
  const [newName, setNewName] =useState(name);
  const [newEmail, setNewEmail] =useState(email);
  const [newImageUrl, setNewImageUrl] =useState(imageURL);
  const [newImage, setNewImage] =useState(null);
  const [selectedImageName, setSelectedImageName] =useState('No file chosen');
  const switchTabs =(evt, tab) =>{
    const btn =evt.target;
    [...btn.parentNode.children].forEach(child =>child!=btn? child.classList.remove('active'): child.classList.add('active'));
    setCurrentTab(tab);
  }

  const closeForm =() =>{
    document.forms['post-form']?.reset(0);
    setPost({body: null, file: null});
    setShowPostForm(false);
  }

  const closeUpdates =() =>{
    document.forms['profile-form']?.reset(0);
    setName(name); setEmail(email);
    setNewImageUrl(imageURL);
    setShowProfile(false);
  }

  const updateProfilePhoto =async ()=>{
    if(newImage){
      const {filepath} =await fileUpload(newImage, 'profiles');
      const { status, data } =await updateProfileImage({id, filepath});
      if(status ==200){
        setImageURL(filepath);
        const session =JSON.parse(localStorage.getItem('session'));
        localStorage.setItem('session', JSON.stringify({...session, image_url: filepath}));
        closeUpdates();
      }
      alert(data?.message);
    }
  }

  const updateUserBio =async () =>{
    try {
      const {status, data} =await updateBio({id, name: newName, email: newEmail});
      if(status ==200){
        setName(newName); setEmail(newEmail);
        const session =JSON.parse(localStorage.getItem('session'));
        localStorage.setItem('session', JSON.stringify({...session, name: newName, email: newEmail}));
        closeUpdates();
      }
      alert(data?.message)
    } catch ({message}) {
      alert(message)
    }
  }

  const create_post =async () =>{
    const {file, body} =post;
    let attatchment =null;
    [...document.forms['post-form'].querySelectorAll('input, textarea, input')].forEach(child => child.disabled =true);
    try {
      if(file) {
        const {filepath} =await fileUpload(file, 'posts');
        attatchment =filepath;
      }
      if(attatchment || body) {
            const {status, data: {message}} =await uploadPost({author: id, body, attatchment});
            if(status ==201){
                closeForm();
              }
              alert(message || 'Post created');
            };
        } catch ({message}) {
          alert(message);
        }
        [...document.forms['post-form'].querySelectorAll('input, textarea, input')].forEach(child => child.disabled =false);
      }
      const selectFile =() =>{
        const selector =document.getElementById('profile-selector');
        if(selector) selector.click();
      }

      const previewImage =async (image) =>{
        if (image) {
          setNewImage(image);
          setSelectedImageName(image.name)
          const reader = new FileReader();
          reader.onload = function (e) {
            setNewImageUrl(e.target.result)
          };
  
          reader.readAsDataURL(image);
        }
      }

      return (
    <>
      <Helmet>
          <title>Indiagram - Home</title>
      </Helmet>
      <div className="h-full grid grid-cols-2 py-2 gap-8">
        <div className="grid grid-rows-[max-content_auto] gap-5">
          <div className="bg-gray-100 rounded shadow-sm flex justify-between items-center px-5 py-3">
            <button className='bg-purple-700 px-4 py-2 text-white rounded' onClick={() =>setShowPostForm(true)}>Add post</button>
            <div className="font-[700] text-purple-500 ">Timeline</div>
          </div>
          <div className="bg-gray-100 overflow-y-auto rounded-sm"><Posts /></div>
        </div>
        <div className="bg-gray-100 p-5 grid grid-rows-[max-content_max-content_auto]">
          <div className="flex justify-between text-purple-600 items-center">
            <button className="h-9 w-9 bg-purple-100 overflow-hidden rounded-full flex justify-center items-center" onClick={() =>setShowProfile(true)}>
              <img src={imageURL || AVATAR} alt='avatar' className='block w-full h-full object-contain'/>
            </button>
            <h3 className='text-sm font-[600] uppercase'>{name}</h3>
          </div>
          <div className='flex gap-4 py-3 text-[#777] tabs'>
            <button className='active' onClick={event =>switchTabs(event, TABS.PEOPLE)}>People</button>
            <button  onClick={event =>switchTabs(event, TABS.FRIENDS)}>Friends</button>
            <button onClick={event =>switchTabs(event, TABS.REQUESTS)}>Requests</button>
            <button onClick={event =>switchTabs(event, TABS.MESSAGES)}>Messages</button>
            {/* <button onClick={event =>switchTabs(event, TABS.NOTIFICATIONS)}>Notifications</button> */}
          </div>
          <div className="">
            {
              currentTab ==TABS.MESSAGES? (<Messages />): currentTab ==TABS.REQUESTS? (<Requests />): 
              currentTab ==TABS.NOTIFICATIONS? (<Notifications />): currentTab ==TABS.FRIENDS? (<Friends />): (<People />)
            }
          </div>
        </div>
            <Modal visible={showPostForm} setVisible={closeForm}>
              <form className="bg-white px-5 py-8 flex flex-col w-1/2 gap-4 rounded shadow" name='post-form'>
                <h2 className='py-5 text-center font-bold text-2xl uppercase'>New Post</h2>
                <input type='file' accept='image/*' className='block border-[1px] px-2 py-2' onChange={event => setPost({...post, file: event.target.files[0]})}/>
                <label htmlFor=''>Share your mind</label>
                <textarea className='block outline-none border-[1px] resize-none p-5' rows={4} onChange={event =>setPost({...post, body: event.target.value})}></textarea>
                <button type ='button' className='bg-blue-500 px-8 py-3 block mt-4 text-white font-bold rounded' onClick={create_post}>Post</button>
              </form>
            </Modal>

            <Modal visible={showProfile} setVisible={closeUpdates}>
              <form className="bg-white px-5 py-8 flex flex-col w-1/2 gap-4 rounded shadow" name='profile-form'>
                <h3 className='font-bold uppercase text-purple-500'>Profile Photo</h3>
                  <div className="flex flex-col gap-2">
                    <input type='file' accept='image/*' hidden id='profile-selector' onChange={event =>previewImage(event.target.files[0])}/>
                    <button type='button' className='h-20 w-20 rounded flex justify-center items-center border-[1px] mx-auto'><img src={newImageUrl || AVATAR} onClick={selectFile}/></button>
                    <p className='text-[#333] text-center'>{selectedImageName}</p>
                    <button type='button' className='bg-purple-500 px-5 py-3 text-white rounded shadow' onClick={updateProfilePhoto}>{imageURL? 'Change Photo': 'Add Photo'}</button>
                  </div>
                <h3 className='font-bold uppercase text-purple-500'>Bio Details</h3>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col">
                    <label>Name</label>
                    <input className='block border-[1px] px-2 py-3 outline-none rounded' value={newName} onChange={event => setNewName(event.target.value || name)}/>
                  </div>
                  <div className="flex flex-col">
                    <label>Email</label>
                    <input className='block border-[1px] px-2 py-3 outline-none rounded' value={newEmail} onChange={event => setNewEmail(event.target.value || email)}/>
                  </div>
                </div>
                <button type='button' className='bg-blue-500 px-5 py-3 text-white rounded shadow' onClick={updateUserBio}>Update</button>
              </form>
            </Modal>
      </div>
    </>
  )
}

export default Dashboard;