
import React, { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import { Menu, Home as HomeIcon, User } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../css/Layout.css";

const Layout = () => {
  const [isAuth, setIsAuth] = useState(false);
  const {isAuthenticated}=useAuth() 
  const navigate=useNavigate()
  useEffect(()=>{
      setIsAuth(isAuthenticated)
  },[isAuthenticated])


  const handleLogout = () => {
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("userEmail")
    setIsAuth(false); 
    navigate("/signIn")
  };

  return (
    <div className="home-container">
   
      <header className="header">
        <div className="logo">Eventify</div>
        <nav className="nav">
       
          {!isAuth ? (
            <>
              <a href="/" className="nav-link">
                <HomeIcon size={20} /> Home
              </a>
              <a href="/signUp" className="nav-link">
                Sign Up
              </a>
              <a href="/signIn" className="nav-link">
                Sign In
              </a>
              <a href="/guestLogin" className="nav-link">
                Guest Login
              </a>
            </>
          ) : (
            <>
              <a href="/" className="nav-link">
                <HomeIcon size={20} /> Home
              </a>
            
              <a href="/dashboard" className="nav-link">
                <User size={20} /> DashBoard
              </a>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
        <Menu size={24} className="menu-icon" />
      </header>
      <main className="main-content">
        <Outlet /> 
      </main>

   
      <footer className="footer">
        <p>&copy; 2025 Eventify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
