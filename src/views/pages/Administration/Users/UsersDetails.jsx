
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';


const UsersDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/users/${id}`);
                const userData = response.data;

                if (userData) {
                    setUser(userData);


                    if (userData.user && userData.user.email) {
                        setEmail(userData.user.email);
                    }
                }


                if (userData.company_id) {
                    const companyResponse = await axios.get(`https://wd79p.com/backend/public/api/companies/${userData.company_id}`);
                    setCompanyName(companyResponse.data.name);
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);
    
    

    const navigateToUserPage = () => {
        window.location.href = '/users';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading ticket details: {error.message}</div>;
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <h3 className="page-title mb-0">User Details</h3>
                            </div>
                            <div className="col-md-8 float-end ms-auto">
                                <div className="d-flex title-head">
                                    <Link to="#" className="btn btn-link" onClick={navigateToUserPage}>
                                        <i className="las la-arrow-left" /> Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="ticket-detail-head">
                                <div className="row">
                                    {user && (
                                        <>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon">
                                                        <i className="la la-stop-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>Employee Id</h6>
                                                        <span className="badge badge-soft-warning">
                                                            {user.employee_id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon">
                                                        <i className="la la-stop-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>First Name</h6>
                                                        <span className="badge badge-soft-warning">
                                                            {user.first_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon">
                                                        <i className="la la-stop-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>Last Name</h6>
                                                        <span className="badge badge-soft-warning">
                                                            {user.last_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon bg-danger-lights">
                                                        <i className="la la-user" />
                                                    </span>
                                                    <div className="detail-info info-two">
                                                        <h6>Company</h6>
                                                        {companyName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon bg-purple-lights">
                                                        <i className="la la-info-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>Phone</h6>
                                                        <span>
                                                            {user.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon bg-purple-lights">
                                                        <i className="la la-info-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>Role</h6>
                                                        <span>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon bg-purple-lights">
                                                        <i className="la la-info-circle" />
                                                    </span>
                                                    <div className="detail-info">
                                                        <h6>Email</h6>
                                                        <span>
                                                            {email || 'No email available'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <div className="ticket-head-card">
                                                    <span className="ticket-detail-icon bg-warning-lights">
                                                        <i className="la la-calendar" />
                                                    </span>
                                                    <div className="detail-info info-two">
                                                        <h6>Created Date</h6>
                                                        <span>
                                                            {new Date(user.created_at).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};    

export default UsersDetails;