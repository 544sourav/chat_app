import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { chatendpoints } from "../apis";
import { logout } from "./authAPI";


const {
    GETMYCHATS_API,
    GETCHATMESSAGES_API,
    GETMYFRIEND_API,
    CREATGROUP_API
    }=chatendpoints

export const fetchMyChats=async(token,dispatch,navigate)=>{
    const toastId = toast.loading("Loading...")
    let result=[]
    try{
        const response = await apiConnector("GET",GETMYCHATS_API,null, {Authorization:`Bearer ${token}`})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.chats
    }
    catch(error){
        console.log(error)
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        if (error.response?.status === 401) {
            dispatch(logout(navigate)); 
        } else {
            toast.error(errorMessage);
        }

    }
    toast.dismiss(toastId)
    return result

}
export const fetchMyFriends=async(token,dispatch,navigate)=>{
    const toastId = toast.loading("Loading...")
    let result=[]
    try{
        const response = await apiConnector("GET",GETMYFRIEND_API,null, {Authorization:`Bearer ${token}`})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.chats
    }
    catch(error){
        console.log(error)
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        if (error.response?.status === 401) {
            dispatch(logout(navigate)); 
        } else {
            toast.error(errorMessage);
        }

    }
    toast.dismiss(toastId)
    return result

}
export const fetchMessages=async(token,chatId,page)=>{
    const toastId = toast.loading("Loading...")
    let result=[]
    try{
        const response = await apiConnector("GET",`${GETCHATMESSAGES_API.replace(':id', chatId)}`,null, {Authorization:`Bearer ${token}`}, { pages: page })
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data;
        console.log("messages",result)
    }
    catch(error){
        console.log(error)
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(errorMessage);

    }
    toast.dismiss(toastId)
    return result

}
export const createGroup=async(token,name,members)=>{
    const toastId = toast.loading("Loading...")
    
    try{
        const response = await apiConnector("POST",CREATGROUP_API,{name,members}, {Authorization:`Bearer ${token}`})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
    }
    catch(error){
        console.log(error)
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(errorMessage);

    }
    toast.dismiss(toastId)

}