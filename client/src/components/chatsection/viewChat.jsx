/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { MdCancel, MdDownloading } from "react-icons/md";
import { useSocket } from '../../socket';
import { NEW_MESSAGE } from '../../data/event';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import useSocketEvents from '../../hooks/useuseSocketEvents';
import { MessageTemplate } from './messageTemplate';
import { fetchMessages } from '../../service/operations/chatAPI';

export const ViewChat = () => {
  const { chatId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const members = useSelector((state) => state.chat.members[chatId]);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const filereference = useRef(null);
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.profile);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [fileType, setFileType] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMore = () => {
    if (page >= totalPages) return; 
    setPage((prevPage) => prevPage + 1);
    setIsLoadMore(true);
  };

  const loadMessages = async () => {
    try {
      const { messages: fetchedMessages = [], totalPages: fetchedTotalPages = 1 } = await fetchMessages(token, chatId, page);
      setTotalPages(fetchedTotalPages); 
      setMessages((prevMessages) =>
        isLoadMore ? [...fetchedMessages, ...prevMessages] : fetchedMessages
      );
      if (isLoadMore) {
        //chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      } else {
        scrollToBottom();
      }
      setIsLoadMore(false);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  useEffect(() => {
    
    setPage(1);
    loadMessages();
  }, [chatId]);

  useEffect(() => {
   
    loadMessages();
  }, [page]);

 
  const handleNewMessage = ({ chatId: incomingChatId, message }) => {
    if (incomingChatId === chatId) {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    }
  };

  useSocketEvents(socket, {
    [NEW_MESSAGE]: handleNewMessage,
  });

  const changeHandler = (event) => {
    setMessage(event.target.value);
  };

  // const fileChange = (event) => {
  //   const result = event.target.files[0];
  //   if (result) {
  //     previewFile(result);
  //     setFiles(result);
  //   }
  // };
  const fileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      setFileType(file.type); // Save the file type

      // File preview
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        setPreviewSource(fileReader.result);
      };
    }
  };

  const previewFile = (result) => {
    const reader = new FileReader();
    reader.readAsDataURL(result);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const clickHandler = () => {
    filereference.current.click();
  };

  const cancelHandler = () => {
    setPreviewSource(null);
    setFiles(null);
    filereference.current.value = '';
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!message.trim() && !files) return;

    const tempMessage = {
      _id: uuidv4(),
      content: message || '',
      file: files ? files.name : null,
      sender: {
        _id: user._id,
        name: user.userName,
      },
      createdAt: new Date().toISOString(),
      chat: chatId,
    };

    const messageData = {
      chatId,
      members,
      messages: message || '',
      file: files ? files.name : null,
    };
    socket.emit(NEW_MESSAGE, messageData);

    setMessages((prevMessages) => [...prevMessages, tempMessage]);

    setPreviewSource(null);
    setFiles(null);
    setMessage('');
    filereference.current.value = '';
    scrollToBottom();
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <div
        className="h-[calc(100vh-8rem)] pb-[4rem] overflow-y-auto"
        ref={chatContainerRef}
      >
        {page < totalPages && !isLoadMore && (
          <div
            className="text-white flex justify-center items-center gap-x-1 cursor-pointer"
            onClick={loadMore}
          >
            {" "}
            <span>
              <MdDownloading className="text-lg" />
            </span>
            Load more
          </div>
        )}
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <MessageTemplate key={msg._id} chat={msg} userId={user._id} />
          ))
        ) : (
          <div className="text-center text-white mt-5">
            <p> Start your conversation now!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="absolute bottom-0  left-0 w-full border-t border-deepblue-600 bg-deepblue-1000 p-2">
       
        {/* {previewSource && (
          <div className="w-[400px] mb-3 left-0 absolute bottom-14 z-[100]">
            <div
              className="w-full bg-deepblue-700 text-red-500 text-xl flex justify-end h-5"
              onClick={cancelHandler}
            >
              <MdCancel />
            </div>


            <div className="bg-deepblue-600 flex justify-center items-center">
              
              {fileType?.startsWith("image/") && (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="w-[400px] h-[300px] object-contain"
                />
              )}

              
              {fileType?.startsWith("video/") && (
                <video className="w-[400px] h-[300px] object-contain" controls>
                  <source src={previewSource} type={fileType} />
                  Your browser does not support the video tag.
                </video>
              )}

              
              {fileType === "application/pdf" && (
                <iframe
                  src={previewSource}
                  title="PDF Preview"
                  className="w-[400px] h-[300px] object-contain"
                />
              )}

             
              {!fileType?.startsWith("image/") &&
                !fileType?.startsWith("video/") &&
                fileType !== "application/pdf" && (
                  <p className="text-white">
                    File type not supported for preview.
                  </p>
                )}
            </div>
          </div>
        )} */}
        <form onSubmit={submitHandler}>
          <div className="flex relative items-center">
            {/* <input
              type="file"
              name="media"
              onChange={fileChange}
              ref={filereference}
              className="hidden"
            />
            <span
              onClick={clickHandler}
              className="cursor-pointer mr-2 text-deepblue-100 text-xl"
            >
              <GrAttachment />
            </span> */}
            <input
              type="text"
              name="message"
              value={message}
              onChange={changeHandler}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="Write your message..."
              className="w-full text-lg text-gray-400 p-[12px] bg-deepblue-1000 focus:outline-none"
            />
            <button type="submit" className="text-deepblue-100 text-3xl">
              <IoSendSharp />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// import React, { useEffect, useRef, useState } from 'react';
// import { GrAttachment } from "react-icons/gr";
// import { IoSendSharp } from "react-icons/io5";
// import { MdCancel } from "react-icons/md";
// import { useSocket } from '../../socket';
// import { NEW_MESSAGE } from '../../data/event';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';
// import useSocketEvents from '../../hooks/useuseSocketEvents';
// import { MessageTemplate } from './messageTemplate';
// import { fetchMessages } from '../../service/operations/chatAPI';

// export const ViewChat = () => {
//   const { chatId } = useParams();
//   const token = useSelector((state) => state.auth.token);
//   const members = useSelector((state) => state.chat.members[chatId]);
//   const [messages, setMessages] = useState([]);
//   const [page, setPage] = useState(1);
//   const [message, setMessage] = useState('');
//   const [files, setFiles] = useState(null);
//   const [previewSource, setPreviewSource] = useState(null);
//   const [isLoadMore, setIsLoadMore] = useState(false);
//   const filereference = useRef(null);
//   const { socket } = useSocket();
//   const { user } = useSelector((state) => state.profile);
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
  
  
//   const scrollToBottom = () => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   const loadMore = ()=>{
//     const currentPage =page;
//     setPage(currentPage+1);
//     setIsLoadMore(true);
//     loadMessages();
//   }
 
//   const loadMessages = async () => {
//     try {
//       const fetchedMessages = await fetchMessages(token, chatId, page);
//       if (fetchedMessages) {
//         setMessages((prevMessages) =>
//           isLoadMore ? [...fetchedMessages, ...prevMessages] : fetchedMessages
//         );
//         if (isLoadMore) {
            
//            chatContainerRef.current.scrollTop;
//           }
//            else {
//             scrollToBottom();
//           }
//         }

//         setIsLoadMore(false);
//     } catch (error) {
//       console.error("Failed to load messages:", error);
//     }
//   };
// console.log("front end",messages);
//   useEffect(() => {
//     loadMessages(); 
//   }, [chatId, page]);

//   // Handle new messages received from the server
//   const handleNewMessage = ({ chatId: incomingChatId, message }) => {
//     if (incomingChatId === chatId) {
//       setMessages((prevMessages) => [...prevMessages, message]);
//       scrollToBottom();
//     }
//   };

  
//   useSocketEvents(socket, {
//     [NEW_MESSAGE]: handleNewMessage,
//   });

//   const changeHandler = (event) => {
//     setMessage(event.target.value);
//   };

//   const fileChange = (event) => {
//     const result = event.target.files[0];
//     if (result) {
//       previewFile(result);
//       setFiles(result);
//     }
//   };

//   const previewFile = (result) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(result);
//     reader.onloadend = () => {
//       setPreviewSource(reader.result);
//     };
//   };

//   const clickHandler = () => {
//     filereference.current.click();
//   };

//   const cancelHandler = () => {
//     setPreviewSource(null);
//     setFiles(null);
//     filereference.current.value = '';
//   };

//   const submitHandler = (event) => {
//     event.preventDefault();
//     if (!message.trim() && !files) return;

   
//     const tempMessage = {
//       _id: uuidv4(),
//       content: message || '',
//       file: files ? files.name : null,
//       sender: {
//         _id: user._id,
//         name: user.userName,
//       },
//       createdAt: new Date().toISOString(),
//       chat: chatId,
//     };

    
//     const messageData = {
//       chatId,
//       members,
//       messages: message || '',
//       file: files ? files.name : null,
//     };
//     socket.emit(NEW_MESSAGE, messageData);

    
//     setMessages((prevMessages) => [...prevMessages, tempMessage]);


//     setPreviewSource(null);
//     setFiles(null);
//     setMessage('');
//     filereference.current.value = '';
//     scrollToBottom();
//   };

//   return (
//     <div className="relative h-[calc(100vh-3.5rem)]">
//       <div className="h-[calc(100vh-8rem)] pb-12 overflow-y-auto" ref={chatContainerRef}>
//         <div className='text-white flex justify-center' onClick={loadMore}>load more</div>
//         {messages.map((msg) => (
//           <MessageTemplate key={msg._id} chat={msg} userId={user._id} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="absolute bottom-0  left-0 w-full border-t border-deepblue-600 bg-deepblue-1000 p-2">
//         {previewSource && (
//           <div className="w-[400px] mb-3 left-0 absolute bottom-14 z-[100]">
//             <div className="w-full bg-deepblue-700 text-red-500 text-xl flex justify-end h-5" onClick={cancelHandler}>
//               <MdCancel />
//             </div>
//             <div className="bg-deepblue-600 flex justify-center items-center">
//               <img src={previewSource} alt="" className="w-[400px] h-[300px] object-contain" />
//             </div>
//           </div>
//         )}
//         <form onSubmit={submitHandler}>
//           <div className="flex relative items-center">
//             <input type="file" name="media" onChange={fileChange} ref={filereference} className="hidden" />
//             <span onClick={clickHandler} className="cursor-pointer mr-2 text-deepblue-100 text-xl">
//               <GrAttachment />
//             </span>
//             <input
//               type="text"
//               name="message"
//               value={message}
//               onChange={changeHandler}
//               autoComplete="off"
//               autoCorrect="off"
//               autoCapitalize="off"
//               placeholder="Write your message..."
//               className="w-full text-lg text-gray-400 p-[12px] bg-deepblue-1000 focus:outline-none"
//             />
//             <button type="submit" className="text-deepblue-100 text-3xl">
//               <IoSendSharp />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useRef, useState } from 'react';
// import { GrAttachment } from "react-icons/gr";
// import { IoSendSharp } from "react-icons/io5";
// import { MdCancel } from "react-icons/md";
// import { useSocket } from '../../socket';
// import { NEW_MESSAGE } from '../../data/event';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';
// import useSocketEvents from '../../hooks/useuseSocketEvents';
// import { MessageTemplate } from './messageTemplate';
// import { fetchMessages } from '../../service/operations/chatAPI';

// export const ViewChat = () => {
//   const { chatId } = useParams();
//   const token = useSelector((state) => state.auth.token);
//   const members = useSelector((state) => state.chat.members[chatId]);
//   const [messages, setMessages] = useState([]);
//   const [page, setPage] = useState(1); // Current page of messages
//   const [hasMorePages, setHasMorePages] = useState(true); // Flag for infinite scrolling
//   const [message, setMessage] = useState('');
//   const [files, setFiles] = useState(null);
//   const [previewSource, setPreviewSource] = useState(null);
//   const filereference = useRef(null);
//   const { socket } = useSocket();
//   const { user } = useSelector((state) => state.profile);
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const isFetchingPrevious = useRef(false); // Flag to prevent multiple fetches at once

//   // Scroll to the bottom of the chat (for new messages)
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Fetch messages from the backend, supporting pagination
// // Fetch messages from the backend, supporting pagination
// const loadMessages = async (newPage = page) => {
//     try {
//       const fetchedMessages = await fetchMessages(token, chatId, newPage);
//       // Ensure messages is defined and provide an empty array if not
//       const messagesToAdd = fetchedMessages || [];
//       // Append new messages (reverse to maintain chronological order)
//       setMessages((prevMessages) => [...prevMessages, ...messagesToAdd.reverse()]);
//       setHasMorePages(fetchedMessages.totalPages > newPage); // Update flag for infinite scroll
//       setPage(newPage); // Update current page
//       isFetchingPrevious.current = false; // Reset fetching flag
//     } catch (error) {
//       console.error("Failed to load messages:", error);
//     }
//   };
  

//   useEffect(() => {
//     loadMessages(); // Fetch initial messages on component mount
//   }, [chatId]);

//   // Handle new messages received from the server, ensuring smooth scrolling
//   const handleNewMessage = ({ chatId: incomingChatId, message }) => {
//     if (incomingChatId === chatId) {
//       setMessages((prevMessages) => [...prevMessages, message]);
//       scrollToBottom();
//     }
//   };

//   // Set up socket event listeners
//   useSocketEvents(socket, {
//     [NEW_MESSAGE]: handleNewMessage,
//   });

//   const changeHandler = (event) => {
//     setMessage(event.target.value);
//   };

//   const fileChange = (event) => {
//     const result = event.target.files[0];
//     if (result) {
//       previewFile(result);
//       setFiles(result);
//     }
//   };

//   const previewFile = (result) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(result);
//     reader.onloadend = () => {
//       setPreviewSource(reader.result);
//     };
//   };

//   const clickHandler = () => {
//     filereference.current.click();
//   };

//   const cancelHandler = () => {
//     setPreviewSource(null);
//     setFiles(null);
//     filereference.current.value = '';
//   };

//   const submitHandler = (event) => {
//     event.preventDefault();
//     if (!message.trim() && !files) return;

//     // Create temporary message object for immediate display
//     const tempMessage = {
//       _id: uuidv4(),
//       content: message || '',
//       file: files ? files.name : null,
//       sender: {
//         _id: user._id,
//         name: user.userName,
//       },
//       createdAt: new Date().toISOString(),
//       chat: chatId,
//     };

//     // Emit message event to server
//     const messageData = {
//       chatId,
//       members,
//       messages: message || '',
//       file: files ? files.name : null,
//     };
//     socket.emit(NEW_MESSAGE, messageData);

//     // Add the temporary message to the UI
//     setMessages((prevMessages) => [...prevMessages, tempMessage]);

//     // Reset message input and file input
//     setPreviewSource(null);
//     setFiles(null);
//     setMessage('');
//     filereference.current.value = '';
//     scrollToBottom();
//   };

//   // Handle scrolling to load previous messages
//   const handleScroll = () => {
//     if (!chatContainerRef.current) return; // Check if ref is defined

//     const scrollTop = chatContainerRef.current.scrollTop;
//     const scrollHeight = chatContainerRef.current.scrollHeight;
//     const clientHeight = chatContainerRef.current.clientHeight;

//     // If scrolled to the top and there are more pages to fetch
//     if (scrollTop === 0 && hasMorePages && !isFetchingPrevious.current) {
//       isFetchingPrevious.current = true; // Prevent multiple fetches
//       loadMessages(page + 1);
//     }
//   };

//   useEffect(() => {
//     const chatContainer = chatContainerRef.current;
//     if (!chatContainer) return; // Check if ref is defined

//     chatContainer.addEventListener('scroll', handleScroll);
//     return () => {
//       chatContainer.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);

//   return (
//     <div className="relative h-[calc(100vh-3.5rem)]">
//       <div className="h-[calc(100vh-8rem)] pb-12 overflow-y-auto" ref={chatContainerRef}>
//         {messages.map((msg) => (
//           <MessageTemplate key={msg._id} chat={msg} userId={user._id} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="absolute bottom-0 left-0 w-full border-t border-deepblue-600 bg-deepblue-1000 p-2">
//         {previewSource && (
//           <div className="w-[400px] mb-3 left-0 absolute bottom-14 z-[100]">
//             <div className="w-full bg-deepblue-700 text-red-500 text-xl flex justify-end h-5" onClick={cancelHandler}>
//               <MdCancel />
//             </div>
//             <div className="bg-deepblue-600 flex justify-center items-center">
//               <img src={previewSource} alt="" className="w-[400px] h-[300px] object-contain" />
//             </div>
//           </div>
//         )}
//         <form onSubmit={submitHandler}>
//           <div className="flex relative items-center">
//             <input type="file" name="media" onChange={fileChange} ref={filereference} className="hidden" />
//             <span onClick={clickHandler} className="cursor-pointer mr-2 text-deepblue-100 text-xl">
//               <GrAttachment />
//             </span>
//             <input
//               type="text"
//               name="message"
//               value={message}
//               onChange={changeHandler}
//               autoComplete="off"
//               autoCorrect="off"
//               autoCapitalize="off"
//               placeholder="Write your message..."
//               className="w-full text-lg text-gray-400 p-[12px] bg-deepblue-1000 focus:outline-none"
//             />
//             <button type="submit" className="text-deepblue-100 text-3xl">
//               <IoSendSharp />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

