import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { socket } from "../routes/IsLoggedIn";
import { updateMessages } from "../utils/rqUpdate";

export const useSendMessage = (chat) => {
  const user = useSelector((state) => ({ ...state.user.userinfo }));

  return useMutation({
    mutationKey: "useSendMessage",
    mutationFn: async ({ content, chatId, type }) => {
      // Add optimistic update
      const tempId = Math.floor(Math.random() * 100000000000 + 1);
      updateMessages({
        _id: tempId,
        content,
        chat: chatId,
        type,
        sender: user,
        createdAt: new Date().toISOString(),
        isOptimistic: true // Flag to identify optimistic updates
      });

      try {
        const { data } = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/messages/${chatId}/send`,
          { content, type },
          {
            withCredentials: true,
          }
        );
        return data;
      } catch (error) {
        // Log detailed error information
        console.error("Send message error:", error);
        console.error("Error response:", error.response?.data);
        throw error;
      }
    },
    onError: (error) => {
      // Show more detailed error message
      const errorMessage = error?.response?.data?.message || 
                          (error?.response?.status === 500 ? "Server error. Please try again later." : "Failed to send message");
      toast.error(errorMessage);
      
      // Log the error for debugging
      console.error("Send message mutation error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    },
    onSuccess: (data) => {
      const newMessage = data?.data?.message;
      
      // Log success for debugging
      console.log("Message sent successfully:", newMessage);

      socket.emit("new_message", { message: newMessage, chat });
    },
  });
};