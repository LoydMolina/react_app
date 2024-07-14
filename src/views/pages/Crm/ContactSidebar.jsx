import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Calendar } from 'react-feather';

const ContactSidebar = ({ contact }) => {
    if (!contact) {
        return null; // Handle case where contact data is not yet available
    }

    return (
        <div className="col-xl-3">
            <div className="card contact-sidebar">
                <h5>Basic Information</h5>
                <ul className="basic-info">
                    <li>
                        <span><Mail size={15} /></span>
                        <p>{contact.email}</p>
                    </li>
                    <li>
                        <span><Phone size={15} /></span>
                        <p>{contact.phone_number}</p>
                    </li>
                    <li>
                        <span><Calendar size={15} /></span>
                        <p>Created on {new Date(contact.created_at).toLocaleDateString()}</p>
                    </li>
                </ul>

                <div className="other-info">
                    <h5>Other Information</h5>
                    <ul>
                        <li><span className="other-title">Language:</span> {contact.language}</li>
                        <li><span className="other-title">Currency:</span> {contact.currency}</li>
                        <li><span className="other-title">Last Modified:</span> {new Date(contact.updated_at).toLocaleDateString()}</li>
                        <li><span className="other-title">Source:</span> {contact.source}</li>
                    </ul>
                </div>

                <div className="tag-info">
                    <h5>Tags</h5>
                    <ul>
                        {contact.tags && contact.tags.map((tag, index) => (
                            <li key={index}>
                                <Link to="#" className={`bg-${tag.color}-light`}>{tag.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>Contact</h5>
                    <Link to="#" className="com-add" data-bs-toggle="modal" data-bs-target="#add_contact">
                        <i className="las la-plus-circle me-1" /> Add New
                    </Link>
                </div>

                <ul className="company-info com-info">
                    <li>
                        <div>
                            <span><img src={contact.profile_image || 'default-image-path'} alt="contacticon" /></span>
                        </div>
                        <div>
                            <h6>{contact.name}</h6>
                        </div>
                    </li>
                </ul>

                <h5>Social Profiles</h5>
                <ul className="social-info">
                    <li><Link to={contact.facebook}><i className="fa-brands fa-facebook-f" /></Link></li>
                    <li><Link to={contact.twitter}><i className="fa-brands fa-twitter" /></Link></li>
                    <li><Link to={contact.instagram}><i className="fa-brands fa-instagram" /></Link></li>
                    <li><Link to={contact.whatsapp}><i className="fa-brands fa-whatsapp" /></Link></li>
                    <li><Link to={contact.pinterest}><i className="fa-brands fa-pinterest" /></Link></li>
                    <li><Link to={contact.linkedin}><i className="fa-brands fa-linkedin" /></Link></li>
                </ul>
            </div>
        </div>
    );
};

export default ContactSidebar;
