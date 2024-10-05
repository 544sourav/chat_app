/* eslint-disable no-unused-vars */
import React from 'react'
import { Sidebar } from '../components/chatsection/sidebar'
import { Outlet } from 'react-router-dom'

export const Chats = () => {
  return (
    <div className=' relative flex min-h-[calc(100vh-3.5rem)]'>

    <Sidebar/>
    <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto  '>
        <div className='mx-auto'>
            <Outlet/>
        </div>
    </div>

   </div>
  )
}
