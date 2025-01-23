import axios from 'axios'


const apiUser=axios.create(
    {
        baseURL:"http://127.0.0.1:5000/api/user",
        headers: {
            "Content-Type": "application/json", 
        },
        withCredentials:true,

    }
);



const apiEvent = axios.create({
  baseURL: "http://127.0.0.1:5000/api/event",
  withCredentials: true,  
});


const customAxios=axios.create(
  {
      baseURL:"http://127.0.0.1:5000/api",
      withCredentials: true,

  }
);


export const signUpUser=async(userData)=>{
    try{
const response=await apiUser.post("/signUp",userData)
return response.data
    }
    catch(error){
console.log("Error while fetching SignUp api: ",error.message)
return error.response?.data || { message: "Something went wrong" };
    }
}


export const sendMail=async(email)=>{
    try{
        const response=await apiUser.post("/sendMail",email)
        return response.data
    }
    catch(error){
        console.log("error sending mail: ",error);
    }
}

export const verifyMail=async(mailToken)=>{
    try{
        const response=await apiUser.post("/verifyMail",mailToken)
        console.log(response.data,"response in api.js")
        return response.data
    }
    catch(error){
        console.log("error sending mail in api.js: ",error);
    }
}




export const signInUser=async(userData)=>{
    try{
const response=await apiUser.post("/signIn",userData)
console.log(response.data,"in signin api frontend")
return response.data
    }
    catch(error){
console.log("Error while fetching SignIn api: ",error.message)
return error.response?.data || { message: "Something went wrong" };
    }
}



export const verifyToken=async(token)=>{
  
    try{

const response=await apiUser.post("/verifyToken",token)
console.log(response.data,"uuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
return response.data

    }
    catch(error){
console.log("Error while fetching verify token api: ",error.message)
return error.response?.data || { message: "Something went wrong" };
    }
}




const attachInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
          console.error("Axios Error:", error);

          if (!error.response) {
              console.error("Network or CORS issue detected");
              return Promise.reject(error);
          }

          const originalReq = error.config;
          console.log(originalReq,"=====================")

          if (error.response.status === 401 && !originalReq._retry) {
              originalReq._retry = true; // ✅ Prevent infinite loops
              try {
                  // 🔄 Get a new access token (server sets new cookie)
                 const res= await customAxios.get('/getNewAccessToken', { withCredentials: true });
                 const newAccessToken = res.data.accessToken; // Ensure server returns `accessToken`
                 const userEmail=res.data.email;

                 if (newAccessToken) {
                   // ✅ Set the token for all future requests
                   sessionStorage.setItem("accessToken",newAccessToken)
                   sessionStorage.setItem("userEmail",userEmail)
                   
                   axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                   originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
                 }
                  // ✅ Retry the failed request (cookie is automatically included)
                  return axiosInstance(originalReq);
              } catch (refreshError) {
                  console.error('Unable to refresh token:', refreshError);
                  alert('Session expired. Please log in again.');
                  // window.location.href = '/signIn';
              }
          }
          return Promise.reject(error);
      }
  );
};

// Attach interceptor to all instances
attachInterceptor(apiUser);
attachInterceptor(apiEvent);
attachInterceptor(customAxios);




  
  export const createEvent = async (eventData) => {
  
    const token=sessionStorage.getItem("accessToken")
  
    if (!token) {
      console.error("No auth token found");
      return { message: "Unauthorized - No token provided" };
    }
  
    try {
      const response = await apiEvent.post("/createEvent", eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data,"apiiiiii")
      return response.data;

    } catch (error) {
      console.error("Error while fetching create event API: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  }
  
  
  export const getEvents = async() => {
    
    const token=sessionStorage.getItem("accessToken")
  
    if (!token) {
      console.error("No auth token found");
      return { message: "Unauthorized - No token provided" };
    }
  
    try {
      const response = await apiEvent.get("/getEvents", {
        headers: {
            "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data,"apiiiiii")
      return response.data;

    } catch (error) {
      console.error("Error while fetching get event API: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  }
  




export const getAllEvents = async () => {

 
    
    const token=sessionStorage.getItem("accessToken")

    const guestToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('guestToken='))
      ?.split('=')[1];
  

      console.log(guestToken,token,"in api getallevents........................")

    if (!token && !guestToken) {
      console.error("No auth tokenfound");
      return { message: "Unauthorized - No token provided" };
    }
    
  
    try {

  
      if (token) {
        const response = await apiEvent.get("/getAllEvents", {
            headers: {
                "Content-Type": "application/json", 
              Authorization: `Bearer ${token}`,
            }});
            console.log(response.data, "apiiiiii");
      return response.data;

      } else if (guestToken) {
        const response = await apiEvent.get("/getAllEvents", {
            headers: {
                "Content-Type": "application/json", 
              Authorization: `Bearer ${guestToken}`,
            }});
            console.log(response.data, "apiiiiii");
      return response.data;
      }
  
     
  
      
  
    } catch (error) {
      console.error("Error while fetching events: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  };
  


  
  export const getGuestId=async()=>{
    try{
        const res=await apiUser.get("/guestLogin")
        console.log(res,"response from guest login in api")
        return res.data
    }
    catch(error)
    {
console.log(error,"error in api in guest login")
return error.response?.data || { message: "Something went wrong" };
    }
  }



   
  export const updateEvent = async (eventId,formData) => {
   
    const token=sessionStorage.getItem("accessToken")
  
    if (!token) {
      console.error("No auth token found");
      return { message: "Unauthorized - No token provided" };
    }
  
    try {
      console.log(eventId,formData,"in apiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
      const response = await apiEvent.put(`/updateEvent/${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data,"apiiiiii")
      return response.data;

    } catch (error) {
      console.error("Error while fetching update event API: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  }



  export const deleteEvent = async (eventId) => {
  
    const token=sessionStorage.getItem("accessToken")
  console.log(token,"acesss token in delete api")
    if (!token) {
      console.error("No auth token found");
      return { message: "Unauthorized - No token provided-----------" };
    }
  
    try {
      const response = await apiEvent.post("/deleteEvent", eventId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data,"apiiiiii")
      return response.data;

    } catch (error) {
      console.error("Error while fetching delete event API: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  }


  export const getEventById=async(eventId)=>{
    const token=sessionStorage.getItem("accessToken")
  
    if (!token) {
      console.error("No auth token found");
      return { message: "Unauthorized - No token provided" };
    }
  
    try {
      const response = await apiEvent.post("/getEventById", eventId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data,"apiiiiii")
      return response.data;

    } catch (error) {
      console.error("Error while fetching get eventby id API: ", error.message);
      return error.response?.data || { message: "Something went wrong" };
    }
  }