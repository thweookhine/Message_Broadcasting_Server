
import { useContext, createContext, useState } from "react";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../constants/apiConstants";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN_NAME) || "")
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const signupAction = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/registerUser`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.status !== 201 ) {
                const errorData = await response.data;
                throw new Error(errorData.message || "Signup failed");
            }
            if(response.data) {
                setUser(response.data.user)
                setToken(response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token)
                navigate('/dashboard')
                return
            }
        } catch(err) {
            console.log(err)
            setError(err.message);
            throw err;
        }
    }

    const loginAction = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/loginUser`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.data) {
                setUser(response.data.user)
                setToken(response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token)
                navigate('/dashboard')
                return
            }
        }catch(error) {
            if (error.response) {
                if(error.response.data.errors){
                    let errorMsg = ""
                    error.response.data.errors.map((responseErr) => {
                        errorMsg += responseErr.msg + ", "
                    })
                    setError(errorMsg)
                }
                setError(error.response.data.error);
            } else {
                setError("Network error. Please try again.");
            }
        }
    };

    const logout = async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setUser(null);
            setToken("");
            localStorage.removeItem(user)
            localStorage.removeItem(ACCESS_TOKEN_NAME)
            navigate('/login')
        } catch (err) {

        }
    }

    return <AuthContext.Provider value={{token, user, loginAction, signupAction,error, logout}}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext)
}