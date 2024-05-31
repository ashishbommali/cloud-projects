import { Helmet } from 'react-helmet';
import { Form } from '../../components';
import { login } from '../../api/users';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate =useNavigate();
    const [reset, setReset] =useState(false);
    const [serverMessages, setServerMessages] =useState({})
    const {setId, setIsAuth, setName, setEmail, setAccessToken, setImageURL} =useContext(AuthContext);
    const fields =[
        {name: 'email', label: 'Email', placeholder: 'Enter email'},
        {type: 'password', name: 'password', label: 'Password', placeholder: 'Enter password'},
    ];

    const handleLogin =async values =>{
        setReset(false);
        setServerMessages({});
        try {
            const {status, data} =await login(values);
            if(status ==200){
                const {id, name, access_token, email, profile_photo} =data;
                setId(id);
                setName(name)
                setReset(true);
                setIsAuth(true);
                setEmail(email);
                setImageURL(profile_photo);
                setAccessToken(access_token);
                localStorage.setItem('session', JSON.stringify({id, name, access_token, email, isLoggedIn: true, image_url: profile_photo}));
                navigate('/', {replace: true})
            }else setServerMessages(data);
            
        } catch ({message}) {
            alert(message);
        }
    }
    return (
        <>
            <Helmet>
                <title>User Login</title>
            </Helmet>
            <Form fields={fields} className='w-full md:w-4/12 flex flex-col bg-gray-100 py-8 px-6 shadow rounded-md' onSubmit={handleLogin} reset_form ={reset} messages={serverMessages}>
                <div className="class flex flex-col gap-1">
                    <p className="text-sm text-[#444444a9] py-1" style={{textAlign: 'right'}}><NavLink to={'/auth/forgot-password'} className="inline-block text-blue-400 transition-colors duration-150 hover:text-blue-600">Forgot password?</NavLink></p>
                    <button type="sumbit" className="block px-4 py-3 text-white bg-purple-500 transition-colors duration-150 rounded-md hover:bg-purple-700">Login</button>
                    <p className="text-md text-[#444444a9]">New here? <NavLink to={'/auth/register'} className="inline-block text-blue-400 transition-colors duration-150 hover:text-blue-600">Register</NavLink> instead</p>
                </div>
            </Form>
        </>
    )
}

export default Login