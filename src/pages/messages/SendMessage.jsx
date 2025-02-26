import React, { useState, useRef, useEffect } from "react";
import { useSendMessage } from "../../hooks/useSendMessage";
import { Like, Photo, Send, Smile } from "../../svg";
import isRTL from "../../utils/isRTL";
import styles from "./messages.module.css";
import { socket } from "../../routes/IsLoggedIn";
import radialToLinearGradient from "../../utils/radialToLinearGradient";

function SendMessage({
  chat,
  chatId,
  setIsTyping,
  isTyping,
  chatTheme,
  scrollToBottom,
}) {
  const messageRef = useRef();
  const [messageText, setMessageText] = useState("");
  const [delayHandler, setDelayHandler] = useState(null);
  const isSend = messageText.length > 0;

  const handleEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendHandler();
    }
  };

  const { mutate: sendMessage, isSuccess: isMessageSuccess } =
    useSendMessage(chat);

  // Focus the input when component mounts or chatId changes
  useEffect(() => {
    if (messageRef.current) {
      setTimeout(() => {
        messageRef.current.focus();
      }, 300);
    }
  }, [chatId]);

  const sendHandler = () => {
    if (isSend) {
      sendMessage({ content: messageText, type: "text", chatId });
      socket.emit("typing", { room: chatId, status: false });
      setIsTyping(false);
      setMessageText("");
      
      // Focus back on input after sending
      if (messageRef.current) {
        setTimeout(() => {
          messageRef.current.focus();
        }, 100);
      }
    } else {
      sendMessage({ content: "like", type: "like", chatId });
    }
  };

  const typingHandler = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { room: chatId, status: true });
    }
    clearTimeout(delayHandler);
    setDelayHandler(
      setTimeout(() => {
        socket.emit("typing", { room: chatId, status: false });
        setIsTyping(false);
      }, 3000)
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [isMessageSuccess]);

  // Handle visibility changes (for mobile browsers)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && messageRef.current) {
        setTimeout(() => {
          messageRef.current.focus();
        }, 300);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className={styles.send}
      style={{ 
        display: "flex", 
        visibility: "visible", 
        zIndex: 10,
        position: "relative",
        minHeight: "50px",
        backgroundColor: chatTheme?.type === "gradient" 
          ? radialToLinearGradient(chatTheme?.downColor, chatTheme?.topColor) 
          : chatTheme?.color || "var(--bg-primary)"
      }}
    >
      <Photo
        color={
          chatTheme?.type === "gradient"
            ? chatTheme?.downColor
            : chatTheme?.color
        }
      />
      <Smile
        color={
          chatTheme?.type === "gradient"
            ? chatTheme?.downColor
            : chatTheme?.color
        }
      />
      <div className={styles.send_message_wrap}>
        <textarea
          style={{
            direction: `${isRTL(messageText) ? "rtl" : "ltr"}`,
            minHeight: "36px",
            padding: "8px 12px",
            width: "100%",
            resize: "none",
            border: "none",
            borderRadius: "18px",
            backgroundColor: "var(--bg-third)",
            color: "var(--color-primary)",
            outline: "none",
          }}
          value={messageText}
          ref={messageRef}
          onChange={(e) => {
            typingHandler();
            setMessageText(e.target.value);
          }}
          className={styles.send_message}
          placeholder="Aa"
          onKeyDown={handleEnter}
        />
      </div>
      <div 
        onClick={sendHandler}
        style={{ 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: isSend ? "var(--blue-color)" : "transparent"
        }}
      >
        {isSend ? (
          <Send color="#fff" />
        ) : (
          <Like
            color={
              chatTheme?.type === "gradient"
                ? chatTheme?.downColor
                : chatTheme?.color
            }
          />
        )}
      </div>
    </div>
  );
}

export default SendMessage;
