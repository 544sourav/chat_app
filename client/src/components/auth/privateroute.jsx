/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute = ({children}) => {
  const {token} = useSelector((state)=>state.auth)
  if(token!==null){
    return children ?children : <Outlet/>
  }
  else{
     return (
    <Navigate to="/"/>
  )
}
}
