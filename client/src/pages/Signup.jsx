//import React from "react";
//import {Template} from "../components/core/Auth/Template";
import signupImg from "../assets/Employee-On-Cell-phone.jpg"
import { Template } from "../components/auth/template";

const Signup =()=> {
   return (
     <Template
       title="Join the millions connecting through ChitChat for free!"
       desc1="Build relationships for today, tomorrow, and beyond."
       desc2="Engage in conversations that enhance your social skills and enrich your life!"
       image={signupImg}
       formtype="signupForm"
     />
   );
}

export default Signup