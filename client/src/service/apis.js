
const BASE_URL = import.meta.env.VITE_APP_BASEURL
export const endpoints = {
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL +"/auth/login",
    CHECK_USERNAME:BASE_URL+"/auth/checkusername"
}

export const chatendpoints = {
    CREATGROUP_API:BASE_URL+"/chats/creategroup",
    GETMYCHATS_API:BASE_URL+"/chats/fetchchats",
    GETMYFRIEND_API:BASE_URL+"/chats/myfriends",
    GETCHATMESSAGES_API:BASE_URL+"/chats/message/:id",
    UPLOADIMAGE_API:BASE_URL+"/chats/upload"
}
export const userendpoints = {
    SEARCHUSER_API :BASE_URL+"/user/search",
    SENDREQUEST_API :BASE_URL+"/user/sendrequest",
    ACCEPTREQUEST_API:BASE_URL+"/user/reciverequest",
    FETCHREQUEST_API:BASE_URL+"/user/fetchrequest",
}