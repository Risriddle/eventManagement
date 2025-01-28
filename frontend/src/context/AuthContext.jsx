import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInUser, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Validate token on page load
    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");

                if (!token) {
                    setIsAuthenticated(false);
                } else {
                   
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Token validation failed:", error.message);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    // Global login function
    const login = async (email, password) => {
        try {
            const userData = { email, pwd: password };
            const res = await signInUser(userData);
             sessionStorage.removeItem("guestToken")
            if (res.success) {
                sessionStorage.setItem("accessToken", res.accessToken);
                sessionStorage.setItem("userEmail", res.user.email);

                setIsAuthenticated(true);
                navigate("/dashboard");
            } else {
                throw new Error(res.message || "Invalid login credentials.");
            }
        } catch (error) {
            throw error.response?.data?.message || "Something went wrong.";
        }
    };

    // Global logout function
    const logout = async() => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userEmail");
        await logoutUser()
        setIsAuthenticated(false);
        navigate("/signIn");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
