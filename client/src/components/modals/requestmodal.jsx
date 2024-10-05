/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { acceptRequest, getrequests } from '../../service/operations/userAPI'
import toast from 'react-hot-toast'
import { IoMdAdd } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoCloseCircleSharp } from 'react-icons/io5';

export const RequestModal = ({setModal}) => {
  const [requests,setRequests] = useState(null);
  
  const {token} = useSelector((state)=>state.auth)
  const getdata =async()=>{
        
        const toastId = toast.loading("loading...");
        const response  = await getrequests(token);    
        setRequests(response);
        toast.dismiss(toastId);

  }
  const action = async(requestId,accept)=>{
    const response  = await acceptRequest(token,requestId,accept);
  }
  useEffect(()=>{
    getdata();
  },[])
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="relative bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg">
    {/* Close Button */}
    <div className="absolute top-1 right-1 text-white cursor-pointer" onClick={()=>setModal(false)} >
      <IoCloseCircleSharp className="w-8 h-8 hover:text-red-500 transition" />
    </div>
    
    {
      !requests ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        !requests.length ? (
          <p className="text-white text-center">You have no requests</p>
        ) : (
          <div className="text-white">
            {
              requests.map((request, index) => (
                <div key={index} className="relative flex items-center justify-between mb-4 bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <img src={request.sender.profile} alt="" className="w-10 h-10 rounded-full mr-4" />
                    <p>{request.sender.userName}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full hover:bg-green-600 transition" 
                      onClick={() => action(request._id, true)}
                    >
                      <IoMdAdd className="text-white" />
                    </button>
                    <button 
                      className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-full hover:bg-red-600 transition" 
                      onClick={() => action(request._id, false)}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )
      )
    }
  </div>
</div>


  )
}
