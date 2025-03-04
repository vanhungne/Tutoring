import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('currentUser', JSON.stringify({
                accessToken: token
            }));
            toast.success('Login successful');
            navigate('/');
        }
    }, []);

    return <div>Logging you in...</div>;
};

export default LoginSuccess;