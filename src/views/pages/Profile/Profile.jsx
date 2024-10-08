/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AuthContext from "../../../AuthContext"; 
import moment from 'moment';

const Profile = () => {
  const { authState } = useContext(AuthContext); 
  const id = authState.user_id;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://wd79p.com/backend/public/api/users/${id}`);
        setUserData(response.data); 
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Profile"
            title="Dashboard"
            subtitle="Profile"
            modal="#add_indicator"
            name="Add New"
          />
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left" style = {{marginRight: '100px'}}>
                            <h3 className="user-name m-t-0 mb-0" >
                              {userData.first_name} {userData.last_name}
                            </h3>
                            <h6 className="text-muted">{userData.role}</h6>
                            <div className="staff-id">
                              Employee ID : {userData.employee_id}
                            </div>
                            <div className="small doj text-muted">
                              Date of Join : {moment(userData.created_at).format('MMMM DD, YYYY [at] h:mma')}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div> Phone:</div>
                              <div>
                                <Link to={`tel:${userData.phone}`}>
                                  {userData.phone}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text">
                                <Link to={`mailto:${userData.email}`}>
                                  {userData.email}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">{userData.birthday}</div>
                            </li>
                            <li>
                              <div className="title">Address:</div>
                              <div className="text">{userData.address}</div>
                            </li>
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">{userData.gender}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="pro-edit">
                      <Link
                        data-bs-target="#profile_info"
                        data-bs-toggle="modal"
                        className="edit-icon"
                        to="#"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item">
                    <Link
                      to="#emp_profile"
                      data-bs-toggle="tab"
                      className="nav-link active"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Profile Info Tab */}
          {/* <ProfileTab /> */}
        </div>
      </div>
    </>
  );
};

export default Profile;
