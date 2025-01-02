// server.js

const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { socketAuthenticator } = require('./middlewares/auth');
const DataBase = require('./config/database');
const AuthRoutes = require('./routes/Auth');
const chatRoutes = require('./routes/Chats');
const userRoutes = require('./routes/User');
const { NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS} = require('./constants/events');
const Message = require('./models/Message');
const { getSockets } = require('./lib/helpers');
const { onlineUsers, userSocketIDs } = require('./socket/userStatus');
const { v4: uuid } =require("uuid") ;
const { uploadFileToCloudinary } = require('./utils/features');
const fileUpload = require("express-fileupload");
const cloudinary = require("./config/cloudinary");

dotenv.config();
const PORT = process.env.PORT || 5000;

DataBase.connect();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket']
});

app.set('io', io);

// Middlewares
app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
//cloudinary connection
cloudinary.cloudinaryConnect();
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/user', userRoutes);


io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res || {}, async (err) => {
    if (err) {
      console.error('Cookie parser error:', err);
      return next(err);
    }
    try {
      await socketAuthenticator(err, socket, next);
    } catch (authError) {
      console.error('Authentication error:', authError);
      return next(new Error('Authentication failed'));
    }
  });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  const user = socket.user;
  console.log('user', user);
  if (!user) {
    console.error('User not authenticated');
    return socket.disconnect();
  }
  userSocketIDs.set(user.id.toString(), socket.id);
  
  // Handle various socket events
  socket.on(NEW_MESSAGE, async ({ chatId, members, messages,file }) => {
    const messageForRealTime = {
      content: messages,
      file:file,
      _id: uuid(),
      sender: {
        _id: user.id,
        name: user.userName,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDB = {
      content: messages,
      file:file,
      sender: user.id,
      chat: chatId,
    };
    const membersSocket = getSockets(members);
    console.log("membersSocket",membersSocket);
    if(membersSocket.length>0){console.log("membersSocket",membersSocket);
      io.to(membersSocket).emit(NEW_MESSAGE, { chatId, message: messageForRealTime });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
    }
    

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log('error', error);
    }
  });
  // socket.on(NEW_MESSAGE, async ({ chatId, members, messages, file }) => {
  //   const messageForRealTime = {
  //     content: messages,
  //     _id: uuid(),
  //     sender: {
  //       _id: user.id,
  //       name: user.userName,
  //     },
  //     chat: chatId,
  //     createdAt: new Date().toISOString(),
  //     file: null, // Add a field for the image URL
  //   };

  //   const messageForDB = {
  //     content: messages,
  //     sender: user.id,
  //     chat: chatId,
  //     file: null, // Add a field for the image URL
  //   };

  //   // Upload file to Cloudinary if file is not null
  //   if (file) {
  //     try {
  //       console.log("file",file)
  //       const uploadedFile = await uploadFileToCloudinary(
  //         file,
  //         "chitchat"
  //       );
  //       const imageUrl = uploadedFile.secure_url;
  //       console.log("imageurl",imageUrl)
  //       // Update the message objects with the Cloudinary URL
  //       messageForRealTime.imageUrl = imageUrl;
  //       messageForDB.file = imageUrl;
  //     } catch (error) {
  //       console.log("Error uploading file to Cloudinary:", error);
  //     }
  //   }

  //   // Get the socket IDs for the members
  //   const membersSocket = getSockets(members);
  //   console.log("membersSocket", membersSocket);

  //   // Emit the message and alert to members if they are connected
  //   if (membersSocket.length > 0) {
  //     console.log("membersSocket", membersSocket);
  //     io.to(membersSocket).emit(NEW_MESSAGE, {
  //       chatId,
  //       message: messageForRealTime,
  //     });
  //     io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
  //   }

  //   // Save the message in the database
  //   try {
  //     await Message.create(messageForDB);
  //   } catch (error) {
  //     console.log("Error saving message to DB:", error);
  //   }
  // });


 

  socket.on('disconnect', () => {
    userSocketIDs.delete(user.id.toString());
    onlineUsers.delete(user.id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
