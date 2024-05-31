import { useState } from 'react';
import {Helmet} from 'react-helmet';
import {Form} from '../../components';
import { register } from '../../api/users';
import { NavLink, useNavigate } from 'react-router-dom';


const Register = () => {
    const fields =[
        {name: 'name', label: 'Name', placeholder: 'Enter name', validations: {required: {value: true, message: 'Name required*'}}},
        {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email', validations: {required: {value: true, message: 'Email required*'}}},
        {type: 'password', name: 'password', label: 'Password', placeholder: 'Enter password', validations: {required: {value: true, message: 'Password required*'}}},
    ];
    const navigate =useNavigate();
    const [reset, setReset] =useState(false);
    const [serverMessages, setServerMessages] =useState({})
    const handleRegistration =async values =>{
        setReset(false);
        setServerMessages({});
        try {
            const {status, data} =await register(values);
            if(status ==201){
                setReset(true);
                navigate('/auth/login', {replace: true})
            }else setServerMessages(data);
            
        } catch ({message}) {
            alert(message);
        }
    }

    return (
        <>
            <Helmet>
                <title>Create Account</title>
            </Helmet>
            <Form fields={fields} className='w-full md:w-4/12 flex flex-col bg-gray-100 py-8 px-6 shadow rounded-md' onSubmit={handleRegistration} reset_form ={reset} messages={serverMessages}>
                <div className="class flex flex-col gap-1">
                    <button type="sumbit" className="block px-4 py-3 text-white bg-purple-500 transition-colors duration-150 rounded-md hover:bg-purple-700">Register</button>
                    <p className="text-md text-[#444444a9]">Already user? <NavLink to={'/auth/login'} className="inline-block text-blue-400 transition-colors duration-150 hover:text-blue-600">Login</NavLink> instead</p>
                </div>
            </Form>
        </>
    )
}

export default Register;