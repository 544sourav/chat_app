

const { getSockets } = require("../lib/helpers");


exports.emitEvent = (req, event, users, data) => {
    console.log("emitevent1")
    const io = req.app.get("io");
    console.log("emitevent2")
    const usersSocket = getSockets(users);
    console.log("emitevent3")
    console.log(usersSocket)
    if(usersSocket.length>0){
      io.to(usersSocket).emit(event, data);
    }
    console.log("emitevent4")
  };
