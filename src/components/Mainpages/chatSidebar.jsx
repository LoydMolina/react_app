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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://wd79p.com/backend/public/api/users');
        setUsers(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    console.log(`Clicked user ID: ${userId}`);
    setReceiverId(userId); 
    navigate(`/chat/${userId}`);
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
                  <Link to="/admin-dashboard">
                    <i className="la la-home" /> <span>Back to Home</span>
                  </Link>
                </li>
                <li className="menu-title">
                  Direct Chats
                  {/* <Link to="#" data-bs-toggle="modal" data-bs-target="#add_chat_user">
                    <i className="fa-solid fa-plus" />
                  </Link> */}
                </li>
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
                    <Link to="#" onClick={() => handleUserClick(user.user_id)}>
                      <span className="chat-avatar-sm user-img">
                        <img
                          src={user.avatar || '/path/to/default-avatar.png'} 
                          alt={user.first_name}
                          className="rounded-circle"
                        />
                        <span className={`status ${user.status || 'offline'}`} /> 
                      </span>
                      <span className="chat-user">{user.first_name} {user.last_name}</span>{' '}
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
