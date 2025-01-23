

import React, { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'

import { useAuth } from '../context/AuthContext';
import "../css/Home.css";

const Home = () => {
  const [isAuth, setIsAuth] = useState(false);
  const {isAuthenticated}=useAuth() 
  const navigate=useNavigate()
  useEffect(()=>{
      setIsAuth(isAuthenticated)
  },[isAuthenticated])

  const handleLogin = () => {
    navigate("/signIn")
    // setIsAuthenticated(true); 
  };

  const handleSignUp=()=>{
    navigate("/signUp")
  }

  const handleGuestLogin=()=>{
    navigate("/guestLogin")
  }


  return (
    <div className="home-container">

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome to Eventify</h1>
        <p>Plan, manage, and enjoy events seamlessly!</p>
        {!isAuth ? (
          <div>
            <button className="login-btn" onClick={handleLogin}>Sign In</button>
            <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
            <button className="guestlogin-btn" onClick={handleGuestLogin}>Guest Login</button>
            
          </div>
        ) : (
          <p>Welcome back, User!</p>
        )}
      </main>

    </div>
  );
};

export default Home;
