/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// import { useEffect, useMemo, useState,createContext,useContext} from "react";
// import io from "socket.io-client";

// const server = import.meta.env.VITE_SERVER;

// const SocketContext = createContext();

// const useSocket = () => useContext(SocketContext);

// const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Fetch the token from local storage
//     let token = localStorage.getItem("token");

//     if (token) {
//       token = token.replace(/^"|"$/g, '');
//       const socketInstance = io(server, {
//         withCredentials: true,
//         transports: ["websocket"],
//         query: { token } 
//       });

//       socketInstance.on("connect", () => {
//         console.log("Socket connected:", socketInstance.id);
//       });

//       socketInstance.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       setSocket(socketInstance);

//       return () => {
//         socketInstance.disconnect();
//       };
//     }
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { SocketProvider, useSocket };

import { useEffect, useMemo, useState, createContext, useContext } from "react";
import io from "socket.io-client";


const SocketContext = createContext();


const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Function to initialize the socket connection
  const connectSocket = (token) => {
    if (token) {
      const socketInstance = io(import.meta.env.VITE_SERVER, {
        withCredentials: true,
        transports: ["websocket"],
        query: { token },
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketInstance.on("connect_error", (error) => {
        console.log("Socket connection error:", error);
      });

      setSocket(socketInstance);
    }
  };

  useEffect(() => {
   
    let token = localStorage.getItem("token");

    if (token) {
      token = token.replace(/^"|"$/g, '');
      console.log("Reconnecting socket with token:", token);
      connectSocket(token);
    }

    return () => {
      if (socket) socket.disconnect(); 
    };
  }, []); 

  
  const handleUserLogin = (token) => {
    localStorage.setItem("token", token);
    connectSocket(token);
  };

  return (
    <SocketContext.Provider value={{ socket, handleUserLogin }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };

