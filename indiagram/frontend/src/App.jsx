import './assets/css/custom.css';
import { Protected, Public } from './components';
import { useEffect, useState } from 'react';
import AuthContext from './context/AuthContext';
import { PageNotFound } from './pages/exceptions';
import { Dashboard, ProtectedLayout } from './pages/protected';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout, Change, Forgot, Login, Register, Reset } from './pages/auth';

const App = () => {
  const [id, setId] =useState(null);
  const [name, setName] =useState(null);
  const [email, setEmail] =useState(null);
  const [isAuth, setIsAuth] =useState(false);
  const [imageURL, setImageURL] =useState(null);
  const [accessToken, setAccessToken] =useState(null);
  useEffect(() =>{
    const session =JSON.parse(localStorage.getItem('session'));
    setId(session?.id);
    setName(session?.name);
    setEmail(session?.email);
    setAccessToken(session?.access_token);
    setImageURL(session?.image_url);
    setIsAuth(session?.isLoggedIn);
  }, []);
  return (
    <AuthContext.Provider value={{id, setId, isAuth, setIsAuth, name, setName, email, setEmail, accessToken, setAccessToken, imageURL, setImageURL}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element ={<Protected isAuth={isAuth}><ProtectedLayout /></Protected>}>
            <Route index element ={<Dashboard />}/>
          </Route>
          <Route path='/auth' element ={<AuthLayout />}>
            <Route path='login' element ={<Public><Login /></Public>}/>
            <Route path='register' element ={<Public><Register /></Public>}/>
            <Route path='change-password' element ={<Change />}/>
            <Route path='forgot-password' element ={<Public><Forgot /></Public>}/>
            <Route path='reset-password/:id' element ={<Public><Reset /></Public>}/>
          </Route>
          <Route path='*' element ={<PageNotFound />}/>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;