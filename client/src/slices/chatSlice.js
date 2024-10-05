// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: {},
  members: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      // Store all chats in the state

      const chats = action.payload;
      console.log(chats);
      chats.forEach(chat => {
        state.chats[chat._id] = chat;
        state.members[chat._id] = chat.members;
      });
    },
  },
});

export const { setChats } = chatSlice.actions;
export default chatSlice.reducer;
