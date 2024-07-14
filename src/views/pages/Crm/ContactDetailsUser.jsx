import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Edit, MoreVertical } from 'react-feather';

const ContactDetailsUser = ({ contact }) => (
    <div className="col-md-12">
        <div className="contact-head">
            <div className="row align-items-center">
                <div className="col-sm-6">

                </div>
                <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                        {/* Replace with actual pagination or details if needed */}
                        <p>1 of 1</p>
                    </div>
                </div>
            </div>  
        </div>
        <div className="contact-wrap">
            <div className="contact-profile">
                <div className="avatar company-avatar">
                    <img src={contact.profile_image || 'default-image-path'} alt="contacticon" />
                </div>
                <div className="name-user">
                    <h4>{contact.first_name} {contact.last_name}</h4>
                    <p><i className="las la-map-marker" /> {contact.street_address}, {contact.city}, {contact.state_province}, {contact.zipcode}, {contact.country}</p>
                    {/* Adjust badges or ratings specific to contacts if needed */}
                </div>
            </div>
            <div className="contacts-action">
                <Link to="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_compose"><Mail className='me-1' size={15} />Send Email</Link>
                <Link to="#" className="btn-icon" data-bs-toggle="modal" data-bs-target="#edit_contact"><Edit size={15} /></Link>
                <div className="dropdown">
                    <Link to="#" className="dropdown-toggle marg-tp" data-bs-toggle="dropdown" aria-expanded="false"><MoreVertical size={15} /></Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        {/* Replace with appropriate actions for contacts */}
                        <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_contact">Delete</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ContactDetailsUser;
