import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const ProtectedLayout= () => {
  const navigate =useNavigate();
  const {setId, setIsAuth, setName, setEmail, setAccessToken} =useContext(AuthContext);
  const logout =() =>{
    localStorage.clear();
    setAccessToken(null);
    setId(null); setIsAuth(false);
    setName(null); setEmail(null);
    navigate('/auth/login', {replace: true});
  }
  return (
    <>
      <div className="min-h-screen grid grid-rows-[max-content_auto] bg-gray-200 p-5 gap-4">
        <div className="flex justify-between items-center px-5 py-4 bg-gray-100 shadow-sm rounded">
          <div className="uppercase font-[700] text-purple-500">Indiagram</div>
          <div className="uppercase flex justify-end gap-3 items-center">
            <NavLink to={'/auth/change-password'} className='text-sm font-bold text-purple-500'>Change Password</NavLink>
            <button to={'/auth/logout'} className={'font-bold uppercase text-red-500'} onClick={logout}>Logout</button>
          </div>
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default ProtectedLayout;