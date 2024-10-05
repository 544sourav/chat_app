import { combineReducers } from "@reduxjs/toolkit";
import authReducer  from "../slices/authSlice";
import profileReducer  from "../slices/profileSlice";
import chatReducer from "../slices/chatSlice";
// import cartReducer  from "../slices/cartSlice";
// import courseReducer from "../slices/courseSlice";
// import viewCourseReducer from "../slices/viewCourseSlice"


const rootReducer = combineReducers({ 
        profile:profileReducer,
        chat:chatReducer,
        // course:courseReducer,
        // viewCourse:viewCourseReducer
        auth:authReducer,
       
        

})

export default rootReducer