import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Calendar } from 'react-feather';
import { Card } from 'antd';

const ContactSidebar = ({ contact }) => {
    if (!contact) {
        return null;
    }

    return (
        <div className="d-flex flex-wrap">
            <div>
            <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
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
                        <span><Phone size={15} /></span>
                        <p>{contact.telephone}</p>
                    </li>
                    <li>
                        <span><Calendar size={15} /></span>
                        <p>Created on {new Date(contact.created_at).toLocaleDateString()}</p>
                    </li>
                </ul>
            </Card>
            <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
                <h5>Social Profiles</h5>
                <ul className="social-info">
                    <li><Link to={contact.facebook}><i className="fa-brands fa-facebook-f" /></Link></li>
                    <li><Link to={contact.twitter}><i className="fa-brands fa-twitter" /></Link></li>
                    <li><Link to={contact.instagram}><i className="fa-brands fa-instagram" /></Link></li>
                    <li><Link to="#"><i className="fa-brands fa-whatsapp" /></Link></li>
                    <li><Link to="#"><i className="fa-brands fa-pinterest" /></Link></li>
                    <li><Link to={contact.linkedin}><i className="fa-brands fa-linkedin" /></Link></li>
                </ul>
            </Card>
            </div>
            <Card className="me-4 mb-4" style={{ minWidth: '1000px' }}>
                <h5>Notes</h5>
                <ul className="notes">
                    <span>{contact.notes}</span>
                </ul>
            </Card>

            {/* <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
                <h5>Contact</h5>
                <Link to="#" className="com-add" data-bs-toggle="modal" data-bs-target="#add_contact">
                    <i className="las la-plus-circle me-1" /> Add New
                </Link>
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
            </Card> */}

            {/* <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
                <h5>Tags</h5>
                <ul>
                    {contact.tags && contact.tags.map((tag, index) => (
                        <li key={index}>
                            <Link to="#" className={`bg-${tag.color}-light`}>{tag.name}</Link>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
                <h5>Other Information</h5>
                <ul>
                    <li><span className="other-title">Language:</span> {contact.language}</li>
                    <li><span className="other-title">Currency:</span> {contact.currency}</li>
                    <li><span className="other-title">Last Modified:</span> {new Date(contact.updated_at).toLocaleDateString()}</li>
                    <li><span className="other-title">Source:</span> {contact.source}</li>
                </ul>
            </Card> */}
        </div>
    );
};

export default ContactSidebar;
