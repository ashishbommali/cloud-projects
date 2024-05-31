import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from '../../components';
import { resetPassword } from '../../api/users';
import { useNavigate, useParams } from 'react-router-dom';

const Reset = () => {
    const fields =[
        {type: 'password', name: 'password', label: 'Password', placeholder: 'Enter password'},
        {type: 'password', name: 'cpassword', label: 'Confirm Password', placeholder: 'Enter password again'},
    ];
    
    const { id } =useParams();
    const navigate =useNavigate();
    const [reset, setReset] =useState(false);
    const [serverMessages, setServerMessages] =useState({});

    const handleResetPassword =async ({password, cpassword}) =>{
        setReset(false);
        setServerMessages({});
        try {
            if(cpassword ==password){
                const {status} =await resetPassword({password, id});
                if(status ==200){
                    setReset(true);
                    navigate(`/auth/login`, {replace: true})
                }else setServerMessages(data);
            }else setServerMessages({cpassword: 'Passwords do not match*'});
            
        } catch ({message}) {
            alert(message);
        }
    }
    return (
        <>
            <Helmet>
                <title>Create New Password</title>
            </Helmet>
            <Form fields={fields} className='w-full md:w-4/12 flex flex-col bg-gray-100 py-8 px-6 shadow rounded-md' onSubmit={handleResetPassword}  reset_form ={reset} messages={serverMessages}>
                <div className="class flex flex-col gap-1">
                    <button type="sumbit" className="block px-4 py-3 text-white bg-purple-500 transition-colors duration-150 rounded-md hover:bg-purple-700">Reset</button>
                </div>
            </Form>
        </>
    )
}

export default Reset;