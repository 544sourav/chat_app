import  { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { checkUserName, sendOtp } from '../../service/operations/authAPI';
import { setSignupData } from '../../slices/authSlice';


export const SignupForm = () => {

     const [formData, setFormData] = useState( {fullName:"", userName:"",email:"", password:"",confirmPassword:""})
     const [showPassword, setShowPassword] = useState(false);
     const [ showConfirmPassword, setShowConfirmPassword]= useState(false);
     const [isAvailable,setIsAvailable] = useState('')
     const dispatch = useDispatch()
     const navigate = useNavigate()
     const debouncedCheckUsername = useCallback(async (userName) => {
        try {
            const flag = await checkUserName(userName);
            setIsAvailable(flag ? 'yes' : 'no');
        } catch (error) {
            console.error("Error checking username availability:", error);
            setIsAvailable('no');
        }
    }, []);
    

     const changeHandler = (event)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [event.target.name]: event.target.value

             }
          ))
       

        }
   
    useEffect(() => {
        const userName = formData.userName;
    
        if (userName) {
            setIsAvailable('loading');
            const timeoutId = setTimeout(() => {
                debouncedCheckUsername(userName);
            }, 500); 
    
            return () => clearTimeout(timeoutId); 
        }
    }, [formData.userName, debouncedCheckUsername]);

        const submitHandler=(event)=>{
            event.preventDefault();

            if(formData.password !== formData.confirmPassword){
                toast.error("password donot match");
                return;
            }

            const accountData ={
                ...formData,
            }
            dispatch(setSignupData(accountData))
            dispatch(sendOtp(formData.email,navigate))
            console.log("accountData",accountData)

             // Reset
            setFormData({
                fullName: "",
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
               
            })
            
            
        }

   return (
    <div>
        <div className=' flex flex-col gap-4'>
            
            <div>
              

                <form onSubmit={submitHandler} className="flex w-full flex-col gap-y-4">
                    <div className="flex gap-x-4">
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        fullName <sup className="text-red-500">*</sup>
                        </p>
                        <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={changeHandler}
                        placeholder="Enter full name"
                        // style={{
                        //     boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full bg-deepblue-800 p-[12px] text-gray-400  focus:outline-none"
                        />
                    </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        UserName <sup className="text-red-500">*</sup>
                        </p>
                        <input
                        required
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={changeHandler}
                        placeholder="Enter username"
                        // style={{
                        //     boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full bg-deepblue-800 p-[12px] text-gray-400  focus:outline-none"
                        />
                        {
                            isAvailable === 'loading' ? (
                                <p className='text-red-600'>loading</p>
                            ) : isAvailable === 'no' ? (
                                <p className='text-red-600'>Username already taken</p>
                            ) : isAvailable === 'yes' ? (
                                <p className='text-green-600'>Username is available</p>
                            ) : null
                        }
                            
                             
                    </label>
                    </div>
                    <label className="w-70%">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        Email Address <sup className="text-red-500">*</sup>
                    </p>
                    <input
                        required
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        placeholder="Enter email address"
                        // style={{
                        // boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full bg-deepblue-800 p-[12px] text-gray-400  focus:outline-none"
                    />
                   
                    </label>
                    
                    <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        Create Password <sup className="text-red-500">*</sup>
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
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                        Confirm Password <sup className="text-red-500">*</sup>
                        </p>
                        <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={changeHandler}
                        placeholder="Confirm Password"
                        // style={{
                        //     boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        // }}
                        className="w-full bg-deepblue-800 p-[12px] text-gray-400  pr-10 focus:outline-none"
                        />
                        <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                        {showConfirmPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                        </span>
                    </label>
                    </div>
                    <button
                    type="submit"
                    className="mt-2  bg-tele-100 py-[8px] px-[12px] font-medium text-white"
                    >
                    Sign in
                    </button>
                </form>


            </div>

        </div>
    </div>
  )
}
