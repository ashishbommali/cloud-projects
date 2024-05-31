import { Footer } from '../../components';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className='h-screen grid grid-rows-[auto_max-content] bg-gray-200'>
            <div className="w-full h-full flex justify-center items-center p-5">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default AuthLayout;