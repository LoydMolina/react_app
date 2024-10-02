import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Attachment, Avatar_05 } from '../../../../../Routes/ImagePath';
import ChatContent from './chatContent';
import { useAuth } from '../../../../../AuthContext'; 
import { Modal, Button } from 'antd'; // Import Ant Design Modal and Button components

const ChatView = ({ receiverId }) => {
  const { authState } = useAuth(); 
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null); // For storing the selected file
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || !receiverId || !authState.user_id) return;

    const newMessage = {
      sender_id: authState.user_id,
      receiver_id: receiverId,
      message_text: messageText,
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/chat-sent', newMessage);
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

  // Handle file selection and show confirmation modal
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsModalVisible(true); // Show the confirmation modal
    }
  };

  // Handle file submission if the user confirms
  const handleSendFile = async () => {
    if (!file || !receiverId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender_id', authState.user_id);
    formData.append('receiver_id', receiverId);
    formData.append('message_text', 'Download File')

    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/chat-sent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
    } catch (error) {
      console.error('Error sending file:', error);
      setError('Failed to send the file. Please try again.');
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <div className="col-lg-9 message-view task-view">
        <div className="chat-window">
          <div className="fixed-header">
            <div className="navbar">
              <div className="user-details me-auto">
                <div className="float-start user-img">
                  <Link className="avatar" to="/profile" title="User Profile">
                    {/* <img src={Avatar_05} alt="" className="rounded-circle" /> */}
                    <span className="status online" />
                  </Link>
                </div>
                <div className="user-info float-start">
                  <Link to="/profile" title="User Profile">
                    <span>{userData ? `${userData.first_name} ${userData.last_name}` : ''}</span>{" "}
                  </Link>
                </div>
              </div>
              {/* <ul className="nav custom-menu">
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
              </ul> */}
            </div>
          </div>
          <div className="chat-contents">
            <div className="chat-content-wrap">
              <div className="chat-wrap-inner">
                <div className="chat-box">
                  <ChatContent receiverId={receiverId} />
                </div>
              </div>
            </div>
          </div>
          <div className="chat-footer">
            <div className="message-bar">
              <div className="message-inner">
                <input 
                  type="file" 
                  id="attachment" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
                <label htmlFor="attachment" className="link attach-icon">
                  <img src={Attachment} alt="" />
                </label>
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

      {/* Modal for file attachment confirmation */}
      <Modal
        title="Send Attachment"
        visible={isModalVisible}
        onOk={handleSendFile}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Do you want to send this file?</p>
        <p>{file && file.name}</p>
      </Modal>
    </>
  );
};

export default ChatView;
