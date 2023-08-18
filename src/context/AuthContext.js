import axios from "axios";
import { createContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);

    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL_USERS;

    let loginUser = async (email, password) => {

        try {
            let response = await axios.post(
                `${baseURL}/api/auth/token/`,
                {
                    email: email,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            let response_data = await response.data;

            if (response.status === 200) {
                setAuthTokens(response_data);
                setUser(jwt_decode(response_data.access));
                localStorage.setItem("authTokens", JSON.stringify(response_data));
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Incorrect password or email");
            }

            if (error.response.status === 400) {
                let token = await error.response.data.token;
                sessionStorage.setItem("token", token);
                await navigate({
                    pathname: '/confirm-signup'
                },
                {
                    state: {email: email}
                }
                );
            }
        }

    };

    let logoutUser = () => {
        try {

            let token = jwt_decode(authTokens?.access);

            let isExpired = dayjs.unix(token.exp).diff(dayjs()) < 1;

            if (!isExpired) {
                axios.post(
                    `${baseURL}/api/auth/token/blacklist/`, 
                    {refresh: authTokens.refresh},
                    {headers: {
                        "Content-Type": "application/json"
                    }}
                    )
            }  
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem('authTokens');
            navigate('/');
        } catch (error) {
            console.log("Unable to logout");
        }
        
    }

    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        authTokens: authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        error: error,
        setError: setError,
    }

    useEffect(()=> {

        if(authTokens){
            setUser(jwt_decode(authTokens.access));

            let token = jwt_decode(authTokens?.refresh);

            let isExpired = dayjs.unix(token.exp).diff(dayjs()) < 1;

            if (isExpired) {
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem('authTokens');
            }
        }
        setLoading(false);


    }, [authTokens, loading])



    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null: children}
        </AuthContext.Provider>
    )
}