import { initializeSocketConnection } from "../service/chat.socket.js";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChat,
  addMessage,
  clearMessages,
  setChats,
  setChatsError,
  setChatsLoading,
  setCurrentChatId,
  setError,
  setLoading,
  setMessages,
  setMessagesLoading
} from "../chat.slice.js";
import {
  getChats as requestChats,
  getMessages as requestMessages,
  sendMessage as requestMessage
} from "../service/chat.api.js";

// Layer 2: connect the chat screen to Redux and the chat API.
export const useChat = () => {
  const dispatch = useDispatch();
  const sendingRef = useRef(false);
  const selectedChatRequestRef = useRef(0);
  const {
    chats,
    currentChatId,
    messages,
    isLoading,
    error,
    isChatsLoading,
    chatsError,
    isMessagesLoading
  } = useSelector(state => state.chat);

  // Load this user's saved conversations for the sidebar.
  const loadChatHistory = useCallback(async () => {
    dispatch(setChatsLoading(true));
    dispatch(setChatsError(null));

    try {
      const response = await requestChats();
      if (!Array.isArray(response.chats)) {
        throw new Error("The chat history response is invalid.");
      }
      dispatch(setChats(response.chats));
    } catch (requestError) {
      dispatch(setChatsError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Your chat history could not be loaded."
      ));
    } finally {
      dispatch(setChatsLoading(false));
    }
  }, [dispatch]);

  // Restore a saved conversation when the user selects it from the sidebar.
  const openChat = useCallback(async chatId => {
    const requestId = selectedChatRequestRef.current + 1;
    selectedChatRequestRef.current = requestId;
    dispatch(setCurrentChatId(chatId));
    dispatch(clearMessages());
    dispatch(setError(null));
    dispatch(setMessagesLoading(true));

    try {
      const response = await requestMessages({ chatId });
      if (!Array.isArray(response.messages)) {
        throw new Error("The selected conversation could not be read.");
      }

      if (selectedChatRequestRef.current === requestId) {
        dispatch(setMessages(response.messages.map(message => ({
          id: message._id,
          role: message.role === "ai" ? "assistant" : message.role,
          content: message.content
        }))));
      }
    } catch (requestError) {
      if (selectedChatRequestRef.current === requestId) {
        dispatch(setError(
          requestError?.response?.data?.message ||
          requestError?.message ||
          "This conversation could not be opened."
        ));
      }
    } finally {
      if (selectedChatRequestRef.current === requestId) {
        dispatch(setMessagesLoading(false));
      }
    }
  }, [dispatch]);

  // Start a clean conversation without removing any saved chats.
  const startNewChat = useCallback(() => {
    selectedChatRequestRef.current += 1;
    dispatch(setCurrentChatId(null));
    dispatch(clearMessages());
    dispatch(setError(null));
    dispatch(setMessagesLoading(false));
  }, [dispatch]);

  // Show the user's message right away, then add the AI reply when the API responds.
  const sendChatMessage = async message => {
    const cleanMessage = message.trim();
    if (!cleanMessage || sendingRef.current || isMessagesLoading) return false;

    sendingRef.current = true;
    dispatch(setError(null));
    dispatch(addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: cleanMessage
    }));
    dispatch(setLoading(true));

    try {
      const response = await requestMessage({ message: cleanMessage, chatId: currentChatId });

      if (response.chat?._id) {
        dispatch(setCurrentChatId(response.chat._id));
        dispatch(addChat(response.chat));
      }

      if (typeof response.AImessage !== "string" || !response.AImessage.trim()) {
        throw new Error("The server returned an empty AI response.");
      }

      dispatch(addMessage({
        id: response.aimessages?._id || `assistant-${Date.now()}`,
        role: "assistant",
        content: response.AImessage,
        animate: true
      }));
      return true;
    } catch (requestError) {
      dispatch(setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Your message could not be sent."
      ));
      return false;
    } finally {
      dispatch(setLoading(false));
      sendingRef.current = false;
    }
  };

  return {
    initializeSocketConnection,
    chats,
    currentChatId,
    messages,
    isLoading,
    error,
    isChatsLoading,
    chatsError,
    isMessagesLoading,
    loadChatHistory,
    openChat,
    startNewChat,
    sendChatMessage
  };
};
