import { Helmet } from 'react-helmet';
import { Form } from '../../components';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/users';
import AuthContext from '../../context/AuthContext';

const Change = () => {
    const navigate =useNavigate();
    const { id } =useContext(AuthContext);
    const [reset, setReset] =useState(false);
    const [serverMessages, setServerMessages] =useState({});
    const fields =[
        {type: 'password', name: 'opassword', label: 'Old Password', placeholder: 'Enter previous password', validations: {
            required: {
                value: true,
                message: 'Old password required*'
            }
        }},
        {type: 'password', name: 'npassword', label: 'New Password', placeholder: 'Enter password', validations: {
            required: {
                value: true,
                message: 'New password required*'
            }
        }},
        {type: 'password', name: 'cpassword', label: 'Confirm Password', placeholder: 'Enter password again',validations: {
            required: {
                value: true,
                message: 'Confirm password*'
            }
        }
        },
    ]
    const handleChangePassword =async values =>{
        setReset(false);
        setServerMessages({});
        const details ={...values, id};
        try {
            const {status, data} =await changePassword(details);
            if(status ==200){
                setReset(true);
                navigate('/', {replace: true});
            }else setServerMessages(data)
        } catch ({message}) {
            alert(message);
        }
    }
    return (
        <>
            <Helmet>
                <title>Change Password</title>
            </Helmet>
            <Form fields={fields} className='w-full md:w-4/12 flex flex-col bg-gray-100 py-8 px-6 shadow rounded-md' onSubmit={handleChangePassword} messages={serverMessages} reset_form ={reset}>
                <div className="class flex flex-col gap-1">
                    <button type="sumbit" className="block px-4 py-3 text-white bg-purple-500 transition-colors duration-150 rounded-md hover:bg-purple-700">Change</button>
                </div>
            </Form>
        </>
    )
}

export default Change;