/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react'
import * as Icons from 'react-icons/io'
import { IoChatbox, IoMenuOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbarlink'
import { logout } from '../../service/operations/authAPI'
import {  VscSignOut } from "react-icons/vsc"
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { useSocket } from '../../socket'
import useSocketEvents from '../../hooks/useuseSocketEvents'
import { NEW_REQUEST } from '../../data/event'
import toast from 'react-hot-toast'
import { RequestModal } from '../modals/requestmodal'
import { MdGroupAdd } from 'react-icons/md'



export const DropDown = ({token,socket}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [modal,setModal] = useState(false);
  console.log(open)
  const ref = useRef(null)
  
  
  useOnClickOutside(ref, () => setOpen(false))
  return (
    <div onClick={()=>setOpen(!open)} className='relative'>
        <div className='cursor-pointer'><IoMenuOutline className="text-3xl text-white md:text-3xl"/></div>
        { 
            open&&(
                <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[118%] right-0 z-[100] w-[10rem] divide-y-[1px] divide-deepblue-800  rounded-sm  border-deepblue-800 bg-deepblue-1000 "
                ref={ref}>
                   
                    
                    {
                     
            (token&&user) ? (
              <>
              {
                        NavbarLinks.map((link,index)=>{
                            const IconComponent =  Icons[link.icon];
                            return(
                                <div key={index}>
                                  {
                                    link.title=="Requests" ?(
                                      <div onClick={()=>setModal(true) }>
                                        <p className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-white hover:bg-deepblue-700 ">
                                          {IconComponent && <IconComponent className="text-lg" />}
                                        {link.title}
                                    </p>
                                      </div>
                                    ):(
                                    <Link   onClick={() => setOpen(false)} to={link?.path}>
                                    <p className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-white hover:bg-deepblue-700 ">
                                    {IconComponent && <IconComponent className="text-lg" />}
                                        {link.title}
                                    </p>
                                 </Link>
                                 )
                                  }
                                     
                                </div>

                            )
                        })
                    }
                    
                <div
                  onClick={() => {
                    dispatch(logout(navigate,socket))
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-white hover:bg-deepblue-700 border-t-[1px]  border-deepblue-800 "
                >
                  <VscSignOut className="text-lg" />
                  Logout
                </div>
                
              </>

            ):("")
          }
          <Link to="/chats" onClick={() => setOpen(false)}>
                  <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-white hover:bg-deepblue-700 border-t-[1px]  border-deepblue-800  ">
                    <Icons.IoIosMail className="text-lg" />
                    Contact
                  </div>
                  </Link>
                
                </div>
            )
        }
        {modal&&<RequestModal setModal={setModal} />}
    </div>
  )
}
