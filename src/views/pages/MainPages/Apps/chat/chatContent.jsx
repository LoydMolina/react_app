import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../AuthContext';

const ChatMessage = ({ message, senderId }) => {
  return (
    <div className={`chat ${message.sender_id === senderId ? 'chat-right' : 'chat-left'}`}>
      <div className="chat-body">
        <div className="chat-bubble">
          <div className="chat-content">
            <p>{message.message_text}</p>
            <span className="chat-time">{message.created_at}</span>
          </div>
          <div className="chat-action-btns">
            <ul>
              <li>
                <Link to="#" className="share-msg" title="Share">
                  <i className="fa fa-share-alt" />
                </Link>
              </li>
              <li>
                <Link to="#" className="edit-msg">
                  <i className="fa fa-pencil" />
                </Link>
              </li>
              <li>
                <Link to="#" className="del-msg">
                  <i className="fa fa-trash" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatContent = ({ receiverId }) => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const senderId = authState.user_id;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!receiverId || !senderId) {
          console.error('Receiver Id or Sender Id is undefined');
          return;
        }

        const apiUrl = `https://wd79p.com/backend/public/api/chat-user/${receiverId}/${senderId}`;
        const response = await axios.get(apiUrl);
        const allMessages = response.data.ConvoData;
        setMessages(allMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages');
        setMessages([]);
        setLoading(false);
      }
    };


    fetchMessages();

    
    const interval = setInterval(fetchMessages, 5000); 

    return () => {
      clearInterval(interval); 
    };
  }, [senderId, receiverId]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="chats">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} senderId={senderId} />
          ))
        ) : (
          <div>No messages</div>
        )}
      </div>
    </div>
  );
};

export default ChatContent;
