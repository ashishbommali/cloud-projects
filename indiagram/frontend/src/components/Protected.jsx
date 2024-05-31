import { Navigate } from "react-router-dom";

const Protected = ({isAuth, children}) => {
    return isAuth? <>{children}</>: <Navigate to={'/auth/login'} replace/>
}

export default Protected;