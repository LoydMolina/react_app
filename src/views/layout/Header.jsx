import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Applogo, Avatar_02 } from "../../Routes/ImagePath";
import { FaRegBell } from "react-icons/fa";
import WhatsAppChatModal from "../../components/modelpopup/WhatsApp/WhatsAppChatModal";
import { Button } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import "../layout/notif.css";

const Header = () => {
  const { logout, authState } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [dropdown, setDropdown] = useState({ notification: false, profile: false });
  const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", role: "" });
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const handleUnreadMessagesUpdate = (hasUnread) => {
    setUnreadMessages(hasUnread);
  };


  const fetchUserData = async () => {
    if (!authState.user_id) return;
    try {
      const { data } = await axios.get(`https://wd79p.com/backend/public/api/users/${authState.user_id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setUserInfo({ firstName: data.first_name, lastName: data.last_name, role: data.role });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!authState.user_id) return;
    
    try {
      const { data } = await axios.get(`https://wd79p.com/backend/public/api/users/${authState.user_id}/activities/unread`);
      const unread = data.filter((notification) => notification.pivot && notification.pivot.notif_read === 0);
      const read = data.filter((notification) => notification.pivot && notification.pivot.notif_read === 1);

      setUnreadNotifications(unread);
      setNotifications(read);

      const userIds = [...new Set(data.map((n) => n.user_id))];
      const names = await Promise.all(userIds.map(async (userId) => {
        const userResponse = await axios.get(`https://wd79p.com/backend/public/api/users/${userId}`);
        return { [userId]: `${userResponse.data.first_name} ${userResponse.data.last_name}` };
      }));

      setUserNames(Object.assign({}, ...names));

    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const startPolling = () => {
    const poll = async () => {
      await fetchNotifications();
      setTimeout(poll, 5000);
    };
    poll();
  };

  
  useEffect(() => {
    fetchUserData();
    fetchNotifications();
    startPolling();
  }, [authState.user_id]); 

  const handleNotificationClick = async (activityId, link) => {
    await markNotificationAsRead(activityId);
    navigate(link);
  };

  const markNotificationAsRead = async (activityId) => {
    try {
      await axios.post(`https://wd79p.com/backend/public/api/users/${authState.user_id}/activities/${activityId}/read`);
      setUnreadNotifications((prev) => prev.filter((notification) => notification.pivot.activity_id !== activityId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatNotification = (notification) => {
    const { user_id, action, subject_type, created_at, subject_id, pivot } = notification;
    const formattedDate = new Date(created_at).toLocaleString();
    const userName = userNames[user_id] || "Unknown User";
    const subjectType = subject_type.split("\\").pop();
    const linkMap = {
      Ticket: `/ticket-details/${subject_id}`,
      User: `/users-details/${subject_id}`,
      Merge: `/ticket-details/${subject_id}`,
      Contact: `/contact-details/${subject_id}`,
    };
    return {
      activity_id: pivot.activity_id || null,
      message: `${userName} ${action} on ${subjectType} ${subject_id} at ${formattedDate}`,
      link: linkMap[subjectType] || "#",
      isRead: pivot.notif_read === 1,
      created_at: new Date(created_at) 
    };
  };

  const toggleDropdown = (type) => {
    setDropdown((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="header" style={{ right: "0px" }}>
      <div className="header-left">
        <Link to="/employee-dashboard" className="logo">
          <img src={Applogo} width={75} height={75} alt="logo" />
        </Link>
        <Link to="/employee-dashboard" className="logo2">
          <img src={Applogo} width={40} height={40} alt="logo" />
        </Link>
      </div>
      <ul className="nav user-menu">
        <div>
          <Button
            className="nav-item"
            onClick={showModal}
            style={{ backgroundColor: "#45C554", borderColor: "#45C554", color: "#ffffff" }}
            icon={<FaWhatsapp style={{ fontSize: '20px', color: '#ffffff' }} />}
          >
          </Button>
          {unreadMessages  && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: 'red',
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                marginRight: '185px',
              }}></span>
            )}
          <WhatsAppChatModal 
          visible={isModalVisible} 
          onClose={handleClose} 
          onUnreadMessagesUpdate={handleUnreadMessagesUpdate}
          />
        </div>
        <li className="nav-item dropdown">
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={() => toggleDropdown("notification")}
          >
            <i>
              <FaRegBell />
            </i>{" "}
            <span className="badge badge-pill">{unreadNotifications.length}</span>
          </Link>
          <div className={`dropdown-menu dropdown-menu-end notifications ${dropdown.notification ? "show" : ""}`}>
            <div className="topnav-dropdown-header">
              <span className="notification-title">Notifications</span>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                {/* Combine and sort notifications */}
                {[...unreadNotifications, ...notifications].map((notification) => {
                  const { activity_id, message, link, created_at } = formatNotification(notification);
                  return (
                    <li className={`notification-message ${notification.pivot.notif_read === 1 ? "read" : "unread"}`} key={activity_id}>
                      <Link to="#" onClick={() => handleNotificationClick(activity_id, link)}>
                        <div className="media d-flex">
                          <div className="media-body">
                            <p className="noti-details">{message}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </li>
        <li className="nav-item dropdown has-arrow main-drop">
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            onClick={() => toggleDropdown("profile")}
          >
            {/* <span className="user-img me-1">
              <img src={Avatar_02} alt="" className="rounded-circle" width={31} />
              <span className="status online" />
            </span> */}
            <span>
              {userInfo.firstName} {userInfo.lastName}
            </span>
          </Link>
          <div className={`dropdown-menu dropdown-menu-end ${dropdown.profile ? "show" : ""}`}>
            <Link to="/profile" className="dropdown-item">
              My Profile
            </Link>
            <Link to="#" className="dropdown-item" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Header;
