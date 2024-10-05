

const { userSocketIDs } = require("../socket/userStatus");



exports.getSockets = (users = []) => {
    console.log("getsocket1",users)
    const sockets = users.map(user => userSocketIDs.get(user.toString())).filter(socketId => socketId !== undefined);
    console.log("getsocket1",sockets)

    return sockets;
};

exports.getOtherMember = (members, userId) =>
   members.find((member) => member._id.toString() !== userId.toString());
