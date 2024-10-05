/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DropDown } from './dropDown'
import logo from '../../assets/logo.svg'
import { useSocket } from '../../socket'
import toast from 'react-hot-toast'
import { NEW_REQUEST, REFETCH_CHATS,ALERT } from '../../data/event'
import useSocketEvents from '../../hooks/useuseSocketEvents'

export const Navbar = () => {
    const {token} = useSelector((state)=>state.auth)
    const {socket} = useSocket()
  const newrequesthandler =()=>{
    toast("New Friend Request")
  }
  const acceptRequestHandler=()=>{
    toast("refetching chat")
    window.location.reload();
  }
  const eventhandler={
    [NEW_REQUEST]:newrequesthandler,
    [REFETCH_CHATS]:acceptRequestHandler
  }
  useSocketEvents(socket,eventhandler);

  return (
    <div className='flex h-14 items-center font-inter border-b border-b-deepblue-700 bg-deepblue-800 justify-center'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
        <div>
        
          <Link to={`/`}>
          <img src={logo} alt='chitchat' width={160} height={32} loading='lazy'   />
          </Link>
          
        </div>
        <div className='flex gap-x-4 items-center'>
        {
         token === null && (
         <Link to="/signup">
            <button className='  text-white bg-deepblue-100 px-2 sm:px-2 md:px-3 md:py-2 py-1 text-xs sm:text-base rounded-sm '>Sign Up</button>
         </Link>
         )
        }
        {
         token === null && (
         <Link to="/">
            <button className='   text-white bg-deepblue-100 px-2 sm:px-2 md:px-4 md:py-2 py-1 text-xs sm:text-base rounded-sm '>log In</button>
         </Link>
         )
        }

         <DropDown token={token} socket={socket}/> 
        </div>
      
      </div> 

      

    </div>
  )
}
