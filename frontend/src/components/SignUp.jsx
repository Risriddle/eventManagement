



import { React, useState } from 'react';
import { signUpUser, sendMail } from '../services/api.js';
import '../css/SignUp.css'; // Import the separate CSS file for styling

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [mailSent, setMailSent] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validatePassword(pass)) {
      setError(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    if (pass !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    const userData = { email: email, pwd: pass };

    try {
      setSubmitting(true);
      setError('');
      setMailSent('');

      const res = await signUpUser(userData);
      console.log(res, "Signup response");

      if (res && res.message === "User already registered!") {
        setError(res.message);
      } else {
        try{
          const sendEmail = await sendMail({ email: email });
        console.log(sendEmail, "Email send response");

        setMailSent("Kindly verify your email. A verification link has been sent to your email.");
        }
        catch(error)
        {
          setMailSent(error)
        }
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create a New Account</h2>
        <form onSubmit={handleSignUp}>
        
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

          <div className="input-group">
            <label htmlFor='confirmPwd'>Confirm Password</label>
            <input
              type="password"
              id="confirmPwd"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {mailSent && <p className="success-message">{mailSent}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>
         
        </form>

        <p className="signin-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;



