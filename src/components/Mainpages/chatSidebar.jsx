import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ChatSidebar = ({ setReceiverId }) => {
  const { authState } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [homeLink, setHomeLink] = useState('/admin-dashboard');
  const [notifications, setNotifications] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authState.token) {
        setLoading(false);
        return; 
      }

      try {
        const response = await axios.get('https://wd79p.com/backend/public/api/users', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authState.token]);

  useEffect(() => {
    if (authState.role === 'Agent') {
      setHomeLink('/employee-dashboard');
    } else {
      setHomeLink('/admin-dashboard');
    }
  }, [authState.role]);

  // Fetch notifications for all users on mount
  useEffect(() => {
    const fetchAllNotifications = async () => {
      if (!authState.token) return;

      try {

        for (const user of users) {
          await fetchNotifications(user.user_id);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchAllNotifications();
  }, [users]); 

  const fetchNotifications = async (receiverId) => {
    if (!authState.token) return;

    try {
      const response = await axios.get(`https://wd79p.com/backend/public/api/chat-user/${receiverId}/${authState.user_id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      const unseenMessages = response.data.ConvoData.filter(message =>
        message.receiver_id === authState.user_id && message.seen_status === 0
      );

      if (unseenMessages.length > 0) {
        setNotifications(prev => ({ ...prev, [receiverId]: unseenMessages.length }));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleUserClick = async (userId) => {
    setReceiverId(userId);
    await markMessagesAsSeen(userId);
  };

  const markMessagesAsSeen = async (receiverId) => {
    if (!authState.token) return;

    try {
      const response = await axios.get(`https://wd79p.com/backend/public/api/chat-user/${receiverId}/${authState.user_id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      const messages = response.data.ConvoData;
      const unseenMessages = messages.filter(message => message.receiver_id === authState.user_id && message.seen_status === 0);
      for (const message of unseenMessages) {
        const chatId = message.id;

        await axios.post(`https://wd79p.com/backend/public/api/chat/mark-as-read/${chatId}`, {}, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      }
      setNotifications(prev => ({ ...prev, [receiverId]: 0 }));

    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <nav className="greedy">
              <ul className="link-item">
                <li>
                  <Link to={homeLink} className="back-to-home-link">
                    <i className="la la-home" /> <span>Back to Home</span>
                  </Link>
                </li>
                <li className="menu-title">Direct Chats</li>
                <li>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="form-control"
                  />
                </li>
                {filteredUsers.map((user) => (
                  <li key={user.user_id}>
                    <Link 
                      to="#" 
                      onClick={() => handleUserClick(user.user_id)} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <span className="chat-avatar-sm user-img w-8 h-8 bg-gray-300 rounded-full"></span> {/* Placeholder avatar */}
                      <span className="flex items-center">
                        <span className="chat-user text-gray-900 font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        {notifications[user.user_id] > 0 && (
                          <span className="notification-dot" 
                          style={{ 
                            fontWeight:'bold', 
                            width:'10px', height:'10px', 
                            borderRadius:'200%', 
                            backgroundColor:'red', 
                            display: 'inline-block',
                            marginLeft:'6px',
                            marginBottom:'15px',
                          }}></span> 
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default ChatSidebar;
