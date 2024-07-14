import React, { useState } from 'react';
import ChatSidebar from '../../../../../components/Mainpages/chatSidebar';
import ChatView from '../chat/chatView';
import ChatContent from './chatContent';

const ChatPage = () => {
  const [receiverId, setReceiverId] = useState(null);

  const handleUserClick = (userId) => {
    console.log(`Clicked user ID: ${userId}`);
    setReceiverId(userId); 
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <ChatSidebar onUserClick={handleUserClick} />
      </div>
      <div className="chat-view">
        <ChatView receiverId={receiverId} />
      </div>
      <div className="chat-content">
        {receiverId ? (
          <ChatContent receiverId={receiverId} />
        ) : (
          <div className="select-user">Please select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
