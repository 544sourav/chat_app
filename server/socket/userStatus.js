// src/sockets/userStatus.js

// A map to store the mapping of user IDs to their respective socket IDs
const userSocketIDs = new Map();

// A set to keep track of all currently online users by their user ID
const onlineUsers = new Set();

/**
 * Adds a user's socket ID to the map.
 * @param {string} userId - The ID of the user.
 * @param {string} socketId - The socket ID associated with the user.
 */
const addUserSocket = (userId, socketId) => {
    userSocketIDs.set(userId.toString(), socketId);
};

/**
 * Removes a user's socket ID from the map.
 * @param {string} userId - The ID of the user.
 */
const removeUserSocket = (userId) => {
    userSocketIDs.delete(userId.toString());
};

/**
 * Adds a user to the set of online users.
 * @param {string} userId - The ID of the user.
 */
const addOnlineUser = (userId) => {
    onlineUsers.add(userId.toString());
};

/**
 * Removes a user from the set of online users.
 * @param {string} userId - The ID of the user.
 */
const removeOnlineUser = (userId) => {
    onlineUsers.delete(userId.toString());
};

module.exports = {
    userSocketIDs,
    onlineUsers,
    addUserSocket,
    removeUserSocket,
    addOnlineUser,
    removeOnlineUser
};
