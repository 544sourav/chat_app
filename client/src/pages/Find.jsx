/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'

import { useEffect, useState } from "react"
import { searchUser,sendReq } from '../service/operations/userAPI';
import { useSelector } from 'react-redux';
import { debounce } from '../util/Debounse';
import { TbUserSearch } from "react-icons/tb";
import { IoMdAdd,IoIosTimer } from 'react-icons/io';


export const Find = () => {
    const {token} = useSelector((state)=>state.auth)
    const [username,setUsername] = useState('');
    const [data,setData] = useState(null);
    //const [loading,setLoading] = useState(false);
    const addFriend= async(id)=>{
        console.log(id);
        try{
          sendReq(id,token);
        }
        catch(error){
          console.log("error",error)
        }
        
    }
    const getData = useCallback(async(name)=>{
        try{
            
            const response = await searchUser(token,name);
            console.log('data',response);
            setData(response)
        }
        catch(error){
            console.log(error)
        }
       
    },[token])
    const debouncedSearch = useCallback(debounce((name) => getData(name), 300), [getData]);
    const handleSearch = async(event)=>{
        setUsername(event.target.value)
        debouncedSearch(event.target.value)
        //getData()
    }
    useEffect(()=>{
        getData('')
    },[])
  return (
    <div>
    <div className=' w-full flex flex-col items-center justify-center mt-24'>
      <div className='w-[50%] relative'>
        <input
          type="text"
          placeholder="Search for a user"
          value={username}
          onChange={handleSearch}
          className="w-full text-sm bg-deepblue-800 p-[12px] text-gray-400 focus:outline-none"
        />
        <span className="absolute right-3 top-[8px] z-[10] text-3xl text-deepblue-100">
          <TbUserSearch />
        </span>
      </div>
  
      <div className='w-[50%] h-96 mt-20 overflow-y-auto bg-deepblue-800 rounded-lg p-4 '>
        {
          !data ? (
            <div className="text-gray-400">loading...</div>
          ) : (
            !data.length ? (
              <div className="text-gray-400">User does not exist</div>
            ) : (
              <div>
                {
                  data.map((user, index) => (
                    <div key={index} className=' relative text-white flex items-center mb-4'>
                      <img src={user.profile} alt="" className='w-10 h-10 rounded-full mr-4' />
                      <p>{user.userName}</p>
                      <span className=' absolute w-6 h-6 right-0 bg-tele-100 flex items-center justify-center rounded-full' onClick={()=>addFriend(user._id)} ><IoMdAdd /></span>
                    </div>
                  ))
                }
              </div>
            )
          )
        }
      </div>
    </div>
  </div>
  
  )
}
