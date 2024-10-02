import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../../AuthContext';
import { Empty, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const ChatMessage = ({ message, senderId, receiverId }) => {
  
  const isSender = message.sender_id === senderId || !message.sender_id || message.sender_id !== receiverId || message.sender_id===null;
  const chatPositionClass = isSender ? 'chat-right' : 'chat-left';

  return (
    <div className={`chat ${chatPositionClass}`}>
      <div className="chat-body">
        <div className="chat-bubble">
          <div className="chat-content">
            <Tooltip title={moment(message.created_at).format('LLLL')} placement="top">
              <p>{message.message_text || 'No message content available'}</p>
            </Tooltip>
            <span className="chat-time">{moment(message.created_at).fromNow()}</span>
  
            {message.file && (
              <div className="chat-file">
             {message.type.startsWith('image/') ? (
                <img
                  src={`https://wd79p.com/backend/public/storage/chatdir/${message.file}`}
                  alt="Image preview"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              ) : (
                <a
                  href={`https://wd79p.com/backend/public/storage/chatdir/${message.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {message.file} 
                </a>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
  senderId: PropTypes.number, 
  receiverId: PropTypes.number.isRequired, 
};

const ChatContent = ({ receiverId }) => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const senderId = Number(authState?.user_id);

  useEffect(() => {
    if (!receiverId || !senderId) {
      return;
    }

    const fetchMessages = async () => {
      try {
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
    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollDown = messagesEndRef.current.scrollHeight;
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '300px', flexDirection: 'column' }}>
          <img 
    src="spark.png" 
    alt="Team Chat" 
    style={{ width: '300px', marginTop: '20px' }}  
  />
  <h3>Connect with your team. Start a conversation.</h3>

</div>

    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chats">
      {messages.length > 0 ? (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              senderId={senderId} 
              receiverId={receiverId} 
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div><Empty /></div>
      )}
    </div>
  );
};

export default ChatContent;
