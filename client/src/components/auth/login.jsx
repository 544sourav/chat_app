import  { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { login } from '../../service/operations/authAPI'
import { useSocket } from '../../socket'



export const LoginForm = () => {
    const { handleUserLogin } = useSocket();
    const [formData, setFormData] = useState( {email:"", password:""})
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitHandler=(event)=>{
        event.preventDefault()
        // const accountData ={
        //     ...formData,

        // }
        dispatch(login(formData.email,formData.password,navigate,handleUserLogin))

       // console.log(accountData)

    }



    const changeHandler = (event)=>{
       setFormData((prevData)=>({
           ...prevData,
           [event.target.name]:event.target.value

       }))

       }
  return (
    <div>
        <div className=' flex flex-col gap-4 font-inter'>
            <div>
                <form onSubmit={submitHandler} className="flex w-full flex-col gap-y-4">

                    <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        Email  <sup className="text-red-500">*</sup>
                    </p>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        placeholder="Enter email address"
                        // style={{
                        // boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full  bg-deepblue-800 p-[12px] text-gray-400  focus:outline-none"
                    />
                    </label>

                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        Password <sup className="text-red-500">*</sup>
                        </p>
                        <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        placeholder="Enter Password"
                        // style={{
                        //     boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full bg-deepblue-800 p-[12px] text-gray-400  pr-10  focus:outline-none"
                        />
                        <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                        {showPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                        </span>
                             <Link to='/forgot-password'>
                                 <p className="text-xs mt-1 text-blue-300 max-w-max ml-auto">Forgot password</p>
                             </Link>
                    </label>


                    <button
                    type="submit"
                    className="mt-2  bg-tele-100 py-[8px] px-[12px] font-medium text-white"
                    >
                        Login
                    </button>
                </form>


            </div>

        </div>

    </div>
  )
}
