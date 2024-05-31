import { Helmet } from 'react-helmet';

const PageNotFound = () => {
  return (
    <>
        <Helmet>
            <title>404 - Page not found</title>
        </Helmet>
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <p className="text-gray-300 font-[700] uppercase"><span className='inline-block text-xl text-purple-500'>404</span> | Page Not Found</p>
        </div>
    </>
  )
}

export default PageNotFound;