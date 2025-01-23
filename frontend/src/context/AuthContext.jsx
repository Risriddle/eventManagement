import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const validateToken = async () => {
            try {
                const token=sessionStorage.getItem("accessToken")
                // console.log(token,"in authContexttt fetching auth/access token")
                // if (!token) throw new Error("Token not found");
                console.log("-=============================================")
                const response = await verifyToken({token});
                console.log(response,"verifytoken res in authcontext")
                console.log(response.valid,"authhhhhhhhhhcontextttttt")
                setIsAuthenticated(response.valid);
                
            } catch (error) {
                console.error("Token validation failed:", error.message);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
