import { useContext} from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Public = ({children}) => {
    const { isAuth } =useContext(AuthContext);
    return isAuth? <Navigate to={'/'} replace />: (<>{children}</>)
}

export default Public;