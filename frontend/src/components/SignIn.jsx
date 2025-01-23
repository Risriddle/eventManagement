
import { React, useState } from 'react';
import { signInUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import '../css/SignIn.css'; 

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
 

  const handleSignIn = async (e) => {
    e.preventDefault();

    const userData = { email: email, pwd: pass };

    try {
      setSubmitting(true);
      setError('');

      const res = await signInUser(userData);
      console.log(res.user.email,"888888888888888888888888888888")
      console.log(res, "Signin response");
      
     if(res.success){
      sessionStorage.setItem("accessToken",res.accessToken)
      sessionStorage.setItem("userEmail",res.user.email)
      
      setSubmitting(false)
      navigate("/")

            }
      
   
   
     
    } catch (error) {
      console.error("Error signing up: ", error);
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In to Your Account</h2>
        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <label htmlFor='email'>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label htmlFor='pwd'>Password</label>
            <input
              type="password"
              id="pwd"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;



