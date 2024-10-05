/* eslint-disable react/prop-types */
//import React from 'react'

import { useSelector } from 'react-redux'
import { SignupForm } from './singup'
import { LoginForm } from './login'

export const Template = ({title,desc1,desc2,image,formtype}) => {
    const{loading}=useSelector((state)=>state.auth)

    if(loading){
        return (
            <div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center'>
                <div className='loader '></div>
            </div>
        )
    }
  return (
    <div>
      <div className="  flex lg:flex-row flex-col items-center max-w-[1160px]  ml=0 lg:ml-[100px]  py-12 w-[90%] mx-auto font-inter">
        <div className=" mx-auto  flex w-[45%]  flex-col justify-start gap-y-12 py-4 px-4 md:flex-col md:gap-y-0 md:gap-x-12  border-2 border-deepblue-700">
          <div className=" mx-auto   md:mx-0">
            <h1 className="text-[1.875rem] leading-[2.375rem] text-deepblue-100 font-thin font-pacifico ">
              {title}
            </h1>
            <p className="mt-3 mb-5 text-[1.125rem] leading-[1.625rem]">
              <span className="text-white">{desc1}</span>
              <br />
              <span className="  italic text-[1rem] leading-[1.625rem] text-blue-100">
                {desc2}
              </span>
            </p>
          </div>

          {formtype === "signupForm" ? <SignupForm /> : <LoginForm />}
        </div>

        <div className=" mx-auto   md:mx-0 my-7">
          {/* <img src={Frame} alt=""  width={558}
                    height={504}
                    loading="lazy"
                /> */}
          <div className="h-[25rem] w-[25rem]  ">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-[25rem] w-[25rem] object-cover"

              //  className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
