import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Attachment, Avatar_05 } from '../../../../../Routes/ImagePath';
import ChatContent from './chatContent';
import { useAuth } from '../../../../../AuthContext'; 

const ChatView = ({ receiverId }) => {
  const { authState } = useAuth(); 
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const [userData, setUserData] = useState(null);

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || !receiverId) return; 

    const newMessage = {
      sender_id: authState.user_id,
      receiver_id: receiverId,
      message_text: messageText,
    };

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message:', newMessage); 
      const response = await axios.post('https://wd79p.com/backend/public/api/chat-sent', newMessage);
      console.log('Message sent successfully:', response.data); 
      setMessageText(''); 
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send the message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://wd79p.com/backend/public/api/users/${receiverId}`);
        setUserData(response.data); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (receiverId) {
      fetchUserData();
    }
  }, [receiverId]);

  return (
    <>
      <div className="col-lg-9 message-view task-view">
        <div className="chat-window">
          <div className="fixed-header">
            <div className="navbar">
              <div className="user-details me-auto">
                <div className="float-start user-img">
                  <Link className="avatar" to="/profile" title="User Profile">
                    <img src={Avatar_05} alt="" className="rounded-circle" />
                    <span className="status online" />
                  </Link>
                </div>
                <div className="user-info float-start">
                  <Link to="/profile" title="User Profile">
                    <span>{userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}</span>{" "}
                  </Link>
                </div>
              </div>
              <div className="search-box">
                <div className="input-group input-group-sm">
                  <input type="text" placeholder="Search" className="form-control" />
                  <button type="button" className="btn">
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
              <ul className="nav custom-menu">
                <li className="nav-item">
                  <Link
                    className="nav-link task-chat profile-rightbar float-end"
                    id="task_chat"
                    to="#task_window"
                  >
                    <i className="fa fa-user" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    onClick={() => localStorage.setItem("minheight", "true")}
                    to="/call/voice-call"
                    className="nav-link"
                  >
                    <i className="fa fa-phone" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/call/video-call" className="nav-link">
                    <i className="fa fa-video-camera" />
                  </Link>
                </li>
                <li className="nav-item dropdown dropdown-action">
                  <Link
                    aria-expanded="false"
                    data-bs-toggle="dropdown"
                    className="nav-link dropdown-toggle"
                    to="#"
                  >
                    <i className="fa fa-cog" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right">
                    <Link to="#" className="dropdown-item">
                      Delete Conversations
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Settings
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="chat-contents">
            <div className="chat-content-wrap">
              <div className="chat-wrap-inner">
                <div className="chat-box">
                  <ChatContent  receiverId={receiverId} />
                </div>
              </div>
            </div>
          </div>
          <div className="chat-footer">
            <div className="message-bar">
              <div className="message-inner">
                <Link
                  className="link attach-icon"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#drag_files"
                >
                  <img src={Attachment} alt="" />
                </Link>
                <div className="message-area">
                  <div className="input-group">
                    <textarea
                      className="form-control"
                      placeholder="Type message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={1} 
                      onInput={(e) => {
                        e.target.rows = 1; 
                        const target = e.target;
                        target.rows = target.scrollHeight / 24; 
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <span className="input-group-append">
                      <button
                        className="btn btn-custom"
                        type="button"
                        onClick={handleSendMessage}
                        disabled={isLoading} 
                      >
                        {isLoading ? (
                          <i className="fa fa-spinner fa-spin" />
                        ) : (
                          <i className="fa-solid fa-paper-plane" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              {error && <div className="error-message">{error}</div>} 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatView;
