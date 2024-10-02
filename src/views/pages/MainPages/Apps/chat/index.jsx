/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from "react";
import ChatView from "./chatView";
import ChatRightsidebar from "./chatRightsidebar";
import ChatModals from "./chatModals";
import ChatSidebar from "../../../../../components/Mainpages/chatSidebar"; 

const Chat = () => {
  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []); 
  useEffect(() => {
    let firstload = localStorage.getItem("minheight");
    if (firstload === "false") {
      setTimeout(function () {
        window.location.reload(1);
        localStorage.removeItem("minheight");
      }, 1000);
    }
  }, []);

  const [receiverId, setReceiverId] = useState(null); 

  return (
    <>
      <div
        className="page-wrapper"
        style={{ minHeight: windowDimension.winHeight }}
        >
        <div className="chat-main-row">
          <div className="chat-main-wrapper">
            <ChatSidebar setReceiverId={setReceiverId} />
            <ChatView receiverId={receiverId} />
            <ChatRightsidebar />
            <ChatModals />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
