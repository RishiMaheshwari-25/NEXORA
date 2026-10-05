import { createSlice } from "@reduxjs/toolkit";

// Layer 3: keep the current conversation and request status in Redux.
const chatSlice=createSlice({
  name:"chat",
  initialState:{
    chats:[],
    currentChatId:null,
    messages:[],
    isLoading:false,
    error:null,
    isChatsLoading:false,
    chatsError:null,
    isMessagesLoading:false
  },
  reducers:{
    setChats:(state,action)=>{
        state.chats=action.payload;
    },
    addChat:(state,action)=>{
        state.chats=[
          action.payload,
          ...state.chats.filter(chat=>chat._id!==action.payload._id)
        ];
    },
    setMessages:(state,action)=>{
        state.messages=action.payload;
    },
    addMessage:(state,action)=>{
        state.messages.push(action.payload);
    },
    clearMessages:(state)=>{
        state.messages=[];
    },
    setCurrentChatId:(state,action)=>{
        state.currentChatId=action.payload;
    },
    setLoading:(state,action)=>{
        state.isLoading=action.payload;
    },
    setError:(state,action)=>{
        state.error=action.payload;
    },
    setChatsLoading:(state,action)=>{
        state.isChatsLoading=action.payload;
    },
    setChatsError:(state,action)=>{
        state.chatsError=action.payload;
    },
    setMessagesLoading:(state,action)=>{
        state.isMessagesLoading=action.payload;
    }
  }
})
export const {
  setChats,
  addChat,
  setMessages,
  addMessage,
  clearMessages,
  setCurrentChatId,
  setLoading,
  setError,
  setChatsLoading,
  setChatsError,
  setMessagesLoading
}=chatSlice.actions;
export default chatSlice.reducer;