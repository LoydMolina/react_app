import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import axios from 'axios';
import ContactSidebar from './ContactSidebar';
import ContactDetailsUser from './ContactDetailsUser';
import { useAuth } from "../../../AuthContext";

const ContactDetails = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { authState } = useAuth();
    const userId = authState?.user_id;
    const token = authState?.token; 
    
    useEffect(() => {
        const fetchContact = async () => {
            if (!token) {
                console.error('No token found, user might not be authenticated');
                setError('User not authenticated.');
                return;
            }
    
            setLoading(true);
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/contacts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setContact(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized access. Please log in again.');
                } else {
                    setError('Error fetching contact details. Please try again later.');
                }
                console.error('Error fetching contact details:', error);
                setLoading(false);
            }
        };
        if (userId && token) {
            fetchContact();
        }
    }, [id, userId, token]);
    const handleBack = () => {
        window.location.href = '/contact-list'; 
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h3 className="page-title">Contact Details</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/admin-dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Contact Details</li>
                            </ul>
                        </div>
                        <div className="col-md-8 float-end ms-auto">
                            <div className="d-flex title-head">
                                <Link to="#" className="btn btn-link" onClick={handleBack}><i className="las la-arrow-left" /> Back</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <ContactDetailsUser contact={contact} />
                    <ContactSidebar contact={contact} />
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
