/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import notifications from "../../assets/json/notifications";
import message from "../../assets/json/message";
import { useAuth } from "../../AuthContext";
import {
  Applogo,
  Avatar_02,
  lnEnglish,
  lnFrench,
  lnGerman,
  lnSpanish,
} from "../../Routes/ImagePath";
import { FaRegBell, FaRegComment } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { logout, authState } = useAuth();
  const data = notifications.notifications;
  const datas = message.message;
  const [dropdown, setDropdown] = useState({
    notification: false,
    flag: false,
    isOpen: false,
    profile: false,
  });
  const [flagImage, setFlagImage] = useState(lnEnglish);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://wd79p.com/backend/public/api/users/${authState.user_id}`);
        setFirstName(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authState.user_id) {
      fetchUserData();
    }
  }, [authState.user_id]);

  const handleSidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };
  const onMenuClick = () => {
    document.body.classList.toggle("slide-nav");
  };

  const toggleDropdown = (type) => {
    setDropdown((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const location = useLocation();
  const pathname = location.pathname;

  const credencial = localStorage.getItem("credencial");
  const value = JSON.parse(credencial);
  const userName = value?.email?.split("@")[0];
  const profileName = userName?.charAt(0).toUpperCase() + userName?.slice(1);

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setFlagImage(
      lng === "en"
        ? lnEnglish
        : lng === "fr"
        ? lnFrench
        : lng === "es"
        ? lnSpanish
        : lnGerman
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="header" style={{ right: "0px" }}>
      {/* Logo */}
      <div className="header-left">
        <Link to="/admin-dashboard" className="logo">
          <img src={Applogo} width={75} height={75} alt="logo" />
        </Link>
        <Link to="/admin-dashboard" className="logo2">
          <img src={Applogo} width={40} height={40} alt="logo" />
        </Link>
      </div>
      {/* /Logo */}
      <Link
        id="toggle_btn"
        to="#"
        style={{
          display: pathname.includes("tasks") || pathname.includes("compose") ? "none" : "",
        }}
        onClick={handleSidebar}
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      {/* Header Title */}
      <div className="page-title-box">
        <h3>SparkCRM</h3>
      </div>
      {/* /Header Title */}
      <Link id="mobile_btn" className="mobile_btn" to="#" onClick={onMenuClick}>
        <i className="fa fa-bars" />
      </Link>
      {/* Header Menu */}
      <ul className="nav user-menu">
        {/* Search */}
        <li className="nav-item">
          <div className="top-nav-search">
            <Link to="#" className="responsive-search">
              <i className="fa fa-search" />
            </Link>
            <form>
              <input className="form-control" type="text" placeholder="Search here" />
              <button className="btn" type="submit">
                <i className="fa fa-search" />
              </button>
            </form>
          </div>
        </li>
        {/* /Search */}
        {/* Flag */}
        <li className="nav-item dropdown has-arrow flag-nav">
          <Link
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            to="#"
            role="button"
            onClick={() => toggleDropdown("flag")}
          >
            <img src={flagImage} alt="Flag" height="20" /> {t(i18n.language)}
          </Link>
          <div className={`dropdown-menu dropdown-menu-right ${dropdown.flag ? "show" : ""}`}>
            <Link to="#" className="dropdown-item" onClick={() => changeLanguage("en")}>
              <img src={lnEnglish} alt="Flag" height="16" /> English
            </Link>
            <Link to="#" className="dropdown-item" onClick={() => changeLanguage("fr")}>
              <img src={lnFrench} alt="Flag" height="16" /> French
            </Link>
            <Link to="#" className="dropdown-item" onClick={() => changeLanguage("es")}>
              <img src={lnSpanish} alt="Flag" height="16" /> Spanish
            </Link>
            <Link to="#" className="dropdown-item" onClick={() => changeLanguage("de")}>
              <img src={lnGerman} alt="Flag" height="16" /> German
            </Link>
          </div>
        </li>
        {/* /Flag */}
        {/* Notifications */}
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
            <span className="badge badge-pill">3</span>
          </Link>
          <div className={`dropdown-menu dropdown-menu-end notifications ${dropdown.notification ? "show" : ""}`}>
            <div className="topnav-dropdown-header">
              <span className="notification-title">Notifications</span>
              <Link to="#" onClick={() => setDropdown((prev) => ({ ...prev, notification: false }))} className="clear-noti">
                Clear All
              </Link>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                {data.map((val, index) => (
                  <li className="notification-message" key={index}>
                    <Link to="/app/administrator/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <img alt="" src={val.image} />
                        </span>
                        <div className="media-body">
                          <p className="noti-details">
                            <span className="noti-title">{val.name}</span> {val.contents}{" "}
                            <span className="noti-title">{val.contents_2}</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">{val.time}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <Link to="/app/administrator/activities">View all Notifications</Link>
            </div>
          </div>
        </li>
        {/* /Notifications */}
        {/* Message Notifications */}
        <li className={`nav-item dropdown ${dropdown.isOpen ? "show" : ""}`}>
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={() => toggleDropdown("isOpen")}
          >
            <i>
              <FaRegComment />
            </i>{" "}
            <span className="badge badge-pill">8</span>
          </Link>
          <div className={`dropdown-menu dropdown-menu-end notifications ${dropdown.isOpen ? "show" : ""}`}>
            <div className="topnav-dropdown-header">
              <span className="notification-title">Messages</span>
              <Link to="#" className="clear-noti">
                Clear All
              </Link>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                {datas.map((value, index) => (
                  <li className="notification-message" key={index}>
                    <Link to="/conversation/chat">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={value.image} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">{value.name}</span>
                          <span className="message-time">{value.time}</span>
                          <div className="clearfix" />
                          <span className="message-content">{value.contents}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <Link to="/conversation/chat">View all Messages</Link>
            </div>
          </div>
        </li>
        {/* /Message Notifications */}
        <li className="nav-item dropdown has-arrow main-drop">
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={() => toggleDropdown("profile")}
          >
            {" "}
            <span className="user-img me-1">
              <img src={Avatar_02} alt="img" />
              <span className="status online" />
            </span>
            <span>{firstName.first_name} {firstName.last_name}</span>
          </Link>
          <div className={`dropdown-menu dropdown-menu-end ${dropdown.profile ? "show" : ""}`}>
            <Link className="dropdown-item" to="/profile">
              My Profile
            </Link>
            <Link className="dropdown-item" to="/settings/companysetting">
              Settings
            </Link>
            <Link className="dropdown-item" to="/" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </li>
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <Link
          to="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end dropdown-menu-right">
          <Link className="dropdown-item" to="/profile">
            My Profile
          </Link>
          <Link className="dropdown-item" to="/settings/companysetting">
            Settings
          </Link>
          <Link className="dropdown-item" to="/" onClick={handleLogout}>
            Logout
          </Link>
        </div>
      </div>
      {/* /Mobile Menu */}
    </div>
  );
};

export default Header;
