import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import axios from 'axios';
import ContactSidebar from './ContactSidebar';
import ContactDetailsUser from './ContactDetailsUser';

const ContactDetails = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/contacts/${id}`);
                setContact(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contact details:', error);
                setError('Error fetching contact details. Please try again later.');
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

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
