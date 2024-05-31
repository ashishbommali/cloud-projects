import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from '../../components';
import { forgot } from '../../api/users';
import { NavLink, useNavigate } from 'react-router-dom';

const Forgot = () => {
    const fields =[
        {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email'},
    ];
    const navigate =useNavigate();
    const [reset, setReset] =useState(false);
    const [serverMessages, setServerMessages] =useState({});
    const handleForgotPassword =async ({email}) =>{
        setReset(false);
        setServerMessages({});
        try {
            const {status, data} =await forgot({email});
            if(status ==200){
                const { id } =data;
                setReset(true);
                navigate(`/auth/reset-password/${id}`, {replace: true})
            }else setServerMessages(data);
            
        } catch ({message}) {
            alert(message);
        }
    }
    return (
        <>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <Form fields={fields} className='w-full md:w-4/12 flex flex-col bg-gray-100 py-8 px-6 shadow rounded-md' reset_form ={reset} messages={serverMessages} onSubmit={handleForgotPassword}>
                <div className="class flex flex-col gap-1">
                    <button type="sumbit" className="block px-4 py-3 text-white bg-purple-500 transition-colors duration-150 rounded-md hover:bg-purple-700">Request Password</button>
                    <p className="text-md text-[#444444a9]">Remember password? <NavLink to="/auth/login" className="inline-block text-blue-400 transition-colors duration-150 hover:text-blue-600">Login</NavLink> instead</p>
                </div>
            </Form>
        </>
    )
}

export default Forgot;