/* eslint-disable no-unused-vars */

import { apiConnector } from "../apiConnector";
import{userendpoints} from "../apis";
import toast from "react-hot-toast"

const {
    SEARCHUSER_API,
    SENDREQUEST_API,
    ACCEPTREQUEST_API,
    FETCHREQUEST_API,
 }= userendpoints



export const searchUser = async(token,username)=>{
    let result=[];
    try{
        
        const response = await apiConnector("GET",SEARCHUSER_API,null,{Authorization:`Bearer ${token}`},{name:`${username}`})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        //console.log('response',response);
        result = response.data.users;
        //console.log('result',result);
        
    }
    catch(error){
        console.log(error)
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(errorMessage);
    }
    return result;
}

// export async function sendReq(userId,token){
   
//         try{
//             console.log("api connector")
//             const response  = await apiConnector("PUT",SENDREQUEST_API,{userId},{Authorization:`Bearer ${token}`})
//             console.log("response",response)
//             if(!response.data.success){
//                 // console.log("error message")
//                  throw new Error(response.data.message)
              
//              }
//              toast.success("friend request sent")
//         }
//         catch(error){
//             console.log(error)
//             toast.error(error)
//         }
    
// }
export async function sendReq(userId, token) {
    try {
      console.log("api connector");
  
      // Ensure token is present
      if (!token) {
        toast.error("Authorization token is missing");
        return;
      }
  
      const response = await apiConnector("PUT", SENDREQUEST_API, { userId }, { Authorization: `Bearer ${token}` });
  
      console.log("response", response);
  
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
  
      toast.success("Friend request sent");
    } catch (error) {
      console.log(error);
      
      // Safely extract the error message
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  }
  
export const getrequests = async(token)=>{
    let result =[];
    try{
        const response = await apiConnector("GET",FETCHREQUEST_API,null,{Authorization:`Bearer ${token}`})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.allRequests;
    }
    catch(error){
        console.log("error in getting user chats >>> ",error)
        toast.error(error)
    }
    return result;
}
export async function acceptRequest(token,requestId,accept){
        try{ 
            const response = await apiConnector("PUT",ACCEPTREQUEST_API,{requestId,accept},{Authorization:`Bearer ${token}`})
            if(!response.data.success){
                // console.log("error message")
                 throw new Error(response.data.message);
             }
        }
        catch(error){
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(errorMessage);
        }
}