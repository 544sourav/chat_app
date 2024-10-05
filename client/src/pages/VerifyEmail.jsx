import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
//import { sendOtp, signUp } from '../services/operation/authApi'
import { BiArrowBack } from 'react-icons/bi'
import { RxCountdownTimer } from 'react-icons/rx'
import { sendOtp, signUp } from '../service/operations/authAPI'
export const VerifyEmail = () => {
    const {signupData,loading}=useSelector((state)=>(state.auth))
    console.log("signupData",signupData)
    const [otp,setOtp]= useState("")
    const navigate= useNavigate()

    const dispatch=useDispatch()

    useEffect(()=>{
        if(!signupData){
            navigate('/signup');
        }
    },[])
     
    const submitHandler=(e)=>{
        e.preventDefault()
        const{
            
            fullName,
            userName,
            email,
            password,
            confirmPassword,
        }=signupData

            dispatch(signUp(fullName,userName,email,password,confirmPassword,otp,navigate ))
        
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        {
            loading?(
                <div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center'>
                    <div className='loader '>loading</div>
                </div>
            ):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-deepblue-100 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-200"> a verifivation code has been sent to you. Enter the code below</p>
                    <form onSubmit={submitHandler}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                             renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-deepblue-800 rounded-[0.2rem] text-gray-300 aspect-square text-center focus:border-0 focus:outline-1 focus:outline-teal-400"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}

                        />

                        <button type='submit'
                        className="w-full bg-tele-100 py-[12px] px-[12px]  mt-6 font-medium text-richblack-900">
                            VerifyEmail
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <Link to="/signup">
                        <p className="text-deepblue-100 flex items-center gap-x-2">
                            <BiArrowBack /> Back To Signup
                        </p>
                        </Link>
                        <button
                        className="flex  items-center text-deepblue-100 gap-x-2"
                        onClick={() => dispatch(sendOtp(signupData.email,navigate))}
                        >
                        <RxCountdownTimer />
                        Resend it
                        </button>
                    </div>
                </div>
            )
        }

    </div>
  )
}
