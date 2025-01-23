
import {  useState, useEffect } from 'react';
import { verifyMail } from '../services/api';
import {useNavigate,useLocation} from 'react-router-dom'

const VerifyMail = () => {
  const location = useLocation();
  const [isVerified, setVerified] = useState('');
  const navigate=useNavigate()

  
  useEffect(()=>{
    const mailVerification=async()=>{
        try 
        {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token'); 
        setVerified("Verifying.........")
      if (token){
        const res=await verifyMail({token:token});
        if (!res.verified) {
            setVerified(res.message || 'Verification failed.');
        } else if (res.verified) {
            setVerified('Verification successful.You can login now');
            navigate("/signIn")
        }
    }
}
catch (error) {
    console.error("Error in verifying mail:", error);
    setVerified("An error occurred during verification.");
}
}
mailVerification();
},[location.search])


  return (
    <div>
   {isVerified && <p style={{color:'green'}}>{isVerified}</p>}
    </div>
  );
};

export default VerifyMail