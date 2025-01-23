


import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import VerifyMail from './components/VerifyMail';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEvent from './components/CreateEvent';
import JoinEvent from './components/JoinEvent';
import GuestLogin from './components/GuestLogin';
import Layout from './components/Layout';
import EventDetail from './components/EventDetail';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           
          
          <Route element={<SignUp />} path="/signUp" />
          <Route element={<SignIn />} path="/signIn" />
          <Route element={<VerifyMail />} path="/verifyMail" />
          
          <Route element={<Layout/>} path="/">
          <Route index element={<Home />} />
          <Route element={<GuestLogin />} path="/guestLogin" />
          <Route path="/event/:eventId" element={ <ProtectedRoute><EventDetail/></ProtectedRoute>} />


          <Route
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
            path="/dashboard"
          />
          <Route
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
            path="/createEvent"
          />
          <Route
            element={
              <ProtectedRoute>
                <JoinEvent />
              </ProtectedRoute>
            }
            path="/joinEvent"
          />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
