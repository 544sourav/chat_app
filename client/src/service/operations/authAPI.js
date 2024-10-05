import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import _ from 'lodash';
import toast from "react-hot-toast";



const{
    // RESETPASSTOKEN_API,
    // RESETPASSWORD_API,
    SIGNUP_API,
    SENDOTP_API,
    LOGIN_API,
    CHECK_USERNAME,
}=endpoints


// export function getPasswordResetToken(email,setEmailSent){
//     return async(dispatch)=>{
//         dispatch(setLoading(true));
//         try{
//             const response = await apiConnector("POST",RESETPASSTOKEN_API,{email})

//             //console.log( "RESET TOKEN",response)

//             if(!response.data.success){
//                 throw new Error(response.data.message)
//             }
//             toast.success("Reset Email sent");
//             setEmailSent(true)
//         }

//         catch(error){
//                 console.log("Reset password token error")
//                 toast.error("falied to send email")

//         }
//         dispatch(setLoading(false))
//     }
// }

// export function resetPassword(password, confirmPassword, token,navigate){
//     return async(dispatch)=>{
//         dispatch(setLoading(true))
        
//         try{
//             const response = await apiConnector("POST",RESETPASSWORD_API, {password, confirmPassword, token})
//            // console.log('response',response)
//             if(!response.data.success){
//                 throw new Error(response.data.message)
//              }
//             toast.success("Password reset Successfully")
//             navigate('/login')
            
//         }
//         catch(error){
//             console.log("unable to Reset password",error)
//                 toast.error("unable to Reset password")

//         }
//         dispatch(setLoading(false))
//     }
// }

export  function signUp(
    
    fullName,
    userName,
    email,
    password,
    confirmPassword,
    otp,
    navigate)
    {
        return async(dispatch)=>{
           dispatch(setLoading(true))
          const toastId = toast.loading("Loading...")
            try{
                const response= await apiConnector("POST",SIGNUP_API,{
                    
                    fullName,
                    userName,
                    email,
                    password,
                    confirmPassword,
                    otp})
                    //console.log('response is ',response)
                    if(!response.data.success){
                       // console.log("error message")
                        throw new Error(response.data.message)
                     
                    }
                    toast.success(" signup successfully")
                    navigate("/")
            }
            catch(error){
                    console.log("error in sign up",error)
                    toast.error(error.response.data.message)
                    navigate("/signup")
            }
            dispatch(setLoading(false))
            
            toast.dismiss(toastId)
        }
        
    }

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
       dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",SENDOTP_API,{email})
           // console.log("response of otp is",response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("otpSent successfully")
            navigate('/verify-email')

        }
        catch(error){
            console.log("error is ",error)
            toast.error(error.response.data.message)
        }
        dispatch(setLoading(false))
       toast.dismiss(toastId)
        
    }
}

export function login(email, password, navigate,handleUserLogin) {
  
    return async (dispatch) => {
      const toastId = toast.loading("Loading...");
      dispatch(setLoading(true));
      try {
        const response = await apiConnector("POST", LOGIN_API, { email, password });
        console.log("RESPONSE OF LOGIN >>>", response);
  
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Login successful");
        dispatch(setToken(response.data.token));
        const userImage = response.data?.user?.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
  
        dispatch(setUser({ ...response.data.user, image: userImage }));
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Check if the token is set as a cookie
        document.cookie = `token=${response.data.token}; path=/; secure; SameSite=Strict`;
        handleUserLogin(response.data.token)
        navigate('/chats');
      } catch (error) {
        console.log("error is", error);
        toast.error(error.message || "An error occurred");
      }
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    };
  }
  
export const checkUserName=_.debounce(async(userName)=>{
            let isAvailable;
            try{
                const response= await apiConnector("POST",CHECK_USERNAME,{userName})
                console.log("response",response)
                if(!response.data.success){
                    console.log("message is  is",response.data.message)
                    throw new Error(response.data.message)
                } 
                isAvailable=response.data.isAvailable
                console.log("isAvailable",isAvailable)
            }
            catch(error){
                console.log("error is ",error)
                toast.error(error.response.data.message)
            }
            return isAvailable
        },500)
function removeCookie(name) {
document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
export function logout(navigate,socket) {
  return (dispatch) => {
   // console.log("printing from log out")
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    removeCookie("token")
    if (socket) {
      socket.disconnect();
      console.log("Socket disconnected");
    }
    toast.success("Logged Out")
  //  console.log("printing after success toast in logout function")
    navigate("/")
   // console.log("after navigate in logout")
  }
}