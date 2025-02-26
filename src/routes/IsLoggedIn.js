import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Loading from "../components/UI/Loading/Loading";
import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { queryClient } from "../App";
import chat_notification from "../assets/chat_notification.wav";
import notification_sweet from "../assets/notification_sweet.wav";
import { setOnlineUsers } from "../app/slices/soketSlice";
import { toast } from "react-hot-toast";
import Notification from "../components/UI/Notification/Notification";
import { reciveNoti } from "../app/slices/userSlice";
import {
  updateChatName,
  updateChatTheme,
  updateMessages,
  updateSeenMessages,
} from "../utils/rqUpdate";

export let socket;

function playNotificationSound() {
  const audio = new Audio(chat_notification);
  audio.play();
}

function playNotificationSound2() {
  const audio = new Audio(notification_sweet);
  audio.play();
}

export default function IsLoggedIn({ user }) {
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);

  const msgNoti = (newMessage) => {
    const res = window.location.pathname.split("/").pop() !== newMessage.chat;
    return res;
  };

  useEffect(() => {
    if (user.userinfo) {
      // Make sure we have a valid backend URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
      
      // Initialize socket with error handling
      try {
        socket = io(backendUrl, {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        // Socket connection events
        socket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocketConnected(true);
          
          // Setup user after successful connection
          socket.emit("setup", {
            userId: user.userinfo._id,
            info: {
              id: user.userinfo._id,
              username: user.userinfo.username,
              first_name: user.userinfo.first_name,
              last_name: user.userinfo.last_name,
              photo: user.userinfo.photo,
            },
          });
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          toast.error('Failed to connect to chat server. Please refresh the page.');
        });

        socket.on("online_user", ({ type, info }) => {
          dispatch(setOnlineUsers({ type, info }));
        });

        socket.on("new_notification", ({ notification }) => {
          playNotificationSound2();
          dispatch(
            reciveNoti({
              type: "notification",
            })
          );

          toast.custom((t) => (
            <Notification t={t} toast={toast} notification={notification} />
          ));

          queryClient.setQueryData(["getNotifications"], (oldData) => {
            if (!oldData) return oldData;
            let newData = oldData;
            newData.data.notifications = [
              notification,
              ...newData.data.notifications,
            ];
            return {
              ...oldData,
              newData,
            };
          });
        });

        socket.on("message_recieved", (newMessage) => {
          playNotificationSound();
          dispatch(
            reciveNoti({
              type: "message",
            })
          );

          if (msgNoti(newMessage)) {
            queryClient.setQueryData(["getChats"], (oldData) => {
              if (!oldData) return oldData;
              let newData = oldData;
              const chatIndex = newData.data.chats.findIndex(
                (chat) => chat._id === newMessage.chat
              );
              if (chatIndex !== -1) {
                newData.data.chats[chatIndex].latestMessage = newMessage;
                const chat = newData.data.chats[chatIndex];
                newData.data.chats.splice(chatIndex, 1);
                newData.data.chats.unshift(chat);
              }
              return {
                ...oldData,
                newData,
              };
            });
          }

          updateMessages(newMessage);
        });

        socket.on("chat_name_updated", ({ chatId, chatName }) => {
          updateChatName(chatId, chatName);
        });

        socket.on("chat_theme_updated", ({ chatId, theme }) => {
          updateChatTheme(chatId, theme);
        });

        socket.on("seen", ({ message: newMessage, chat }) => {
          updateSeenMessages(newMessage, chat);
        });
        
        // Cleanup on unmount
        return () => {
          if (socket) {
            socket.disconnect();
          }
        };
      } catch (error) {
        console.error('Error initializing socket:', error);
        toast.error('Failed to initialize chat connection');
      }
    }
  }, [user.userinfo]);

  return user.userinfo ? (
    <>
      <Header />
      <React.Suspense fallback={<Loading />}>
        <Outlet />
      </React.Suspense>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
