

const { getSockets } = require("../lib/helpers");
const cloudinary = require("cloudinary").v2;

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

exports.uploadFileToCloudinary= async(file, folder, height, quality) =>{
  console.log("filein upload",file)
   const options = { folder };
   if (height) {
     options.height = height;
   }
   if (quality) {
     options.quality = quality;
   }

   options.resource_type = "auto";
   return await cloudinary.uploader.upload(file.tempFilePath, options);
 }
