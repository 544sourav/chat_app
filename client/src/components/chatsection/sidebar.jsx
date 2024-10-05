/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { fetchMyChats } from "../../service/operations/chatAPI";
import { useSelector } from "react-redux";
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";
import { setChats } from "../../slices/chatSlice";
import { useDispatch } from "react-redux";

export const Sidebar = () => {
  const [chats, setChat] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getchats = async () => {
    try {
      const response = await fetchMyChats(token, dispatch, navigate);
      console.log("response", response);
      dispatch(setChats(response));
      setChat(response);
    } catch (error) {
      console.log("cound not find chats");
    }
  };
  useEffect(() => {
    getchats();
  }, []);
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="font-inter  text-white border-r border-deepblue-700 bg-deepblue-800 relative flex-col min-w-[222px] flex  h-[calc(100vh-3.5rem)]">
      <div className="text-2xl mt-3 mb-1 border-b border-deepblue-700  px-2 font-semibold">
        <h1>Chats</h1>
      </div>
      {/* <div>
            <input type="text"

             />
        </div> */}
      {!chats ? (
        <p className="text-white grid place-content-center place-items-center">
          Loading....
        </p>
      ) : !chats.length ? (
        <p className="text-white grid place-content-center place-items-center">
          you have no chats
        </p>
      ) : (
        // <div className='text-white z-50 w-64'>
        //     {
        //         // console.log('chat',chats[0].chatName)
        //         chats.map((chat,index)=>(

        //             <NavLink to={`/chats/${chat._id}`} key={index} >
        //                 <div className={`flex  items-center gap-x-3 p-2  hover:bg-deepblue-700 ${matchRoute(`/chats/${chat._id}`) ?"bg-deepblue-700":"bg-deepblue-800"}`}>

        //                         <img src={chat.image}  className="h-12 w-12 rounded-full object-cover" alt="image" />

        //                     <p className='text-lg text-wrap font-medium'>{chat.chatName}</p>
        //                 </div>
        //             </NavLink>
        //         ))
        //     }
        // </div>
        <div className="text-white z-50 w-72">
          {chats.map((chat, index) => (
            <NavLink to={`/chats/${chat._id}`} key={index}>
              <div
                className={`flex items-start gap-x-3 p-2 hover:bg-deepblue-700 ${
                  matchRoute(`/chats/${chat._id}`)
                    ? "bg-deepblue-700"
                    : "bg-deepblue-800"
                }`}
              >
                <img
                  src={chat.image}
                  className="h-12 w-12 rounded-full object-cover"
                  alt="chat image"
                />
                <div className="flex-1">
                  <p className="text-lg font-medium break-words">
                    {chat.chatName}
                  </p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
