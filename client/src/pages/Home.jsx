//import React from 'react'
//import {Template} from "../components/core/Auth/Template";
import loginImg from "../assets/Employee-On-Cell-phone.jpg"
import { Template } from '../components/auth/template'

export const Home = () => {
  return (
    <div>
         <Template
        title="Welcome Back !!"
        desc1="connect with your friends and family"
        desc2="login to do ChitChat"
        image={loginImg}
        formtype="login"/>
    </div>
  )
}
