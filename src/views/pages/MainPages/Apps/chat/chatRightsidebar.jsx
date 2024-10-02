import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Avatar_02, Avatar_05 } from "../../../../../Routes/ImagePath";
import AuthContext from "../../../../../AuthContext"; 
import axios from "axios";

const ChatRightsidebar = () => {
  const { authState } = useContext(AuthContext); 
  const id = authState.user_id;
  const [userData, setUserData] = useState(null);
  const user = userData && userData.user ? userData.user : {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://wd79p.com/backend/public/api/users/${id}`);
        
        setUserData(response.data); 
      } catch (error) {
        // console.error("Error fetching user data:", error);
      }
    };
  
    if (id) {
      fetchUserData();
    }
  }, [id]);
  

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="col-lg-3 message-view chat-profile-view chat-sidebar"
        id="task_window"
      >
        <div className="chat-window video-window">
          <div className="fixed-header">
            <ul className="nav nav-tabs nav-tabs-bottom">
              {/* <li className="nav-item">
                <Link className="nav-link" to="#calls_tab" data-bs-toggle="tab">
                  Calls
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#profile_tab"
                  data-bs-toggle="tab"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="tab-content chat-contents">
            <div className="content-full tab-pane show active" id="profile_tab">
              <div className="display-table">
                <div className="table-row">
                  <div className="table-body">
                    <div className="table-content">
                      <div className="chat-profile-img">
                        {/* <div className="edit-profile-img">
                          <img src={Avatar_02} alt="" />
                        </div> */}
                        <h3 className="user-name m-t-10 mb-0">{userData.first_name} {userData.last_name}</h3>
                        <small className="text-muted">{userData.role}</small>
                      </div>
                      <div className="chat-profile-info">
                        <ul className="user-det-list">
                          {/* <li>
                            <span>Username:</span>
                            <span className="float-end text-muted">
                              johndoe
                            </span>
                          </li> */}
                          <li>
                            <span>DOB:</span>
                            <span className="float-end text-muted">
             
                            </span>
                          </li>
                          <li>
                            <span>Email:</span>
                            <span className="float-end text-muted">
                              {user.email || 'Email not available'}
                            </span>
                          </li>
                          <li>
                            <span>Phone:</span>
                            <span className="float-end text-muted">
                              {userData.phone}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRightsidebar;
