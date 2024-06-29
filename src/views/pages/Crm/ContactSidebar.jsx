import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, } from 'react-feather';

const ContactSidebar = ({ company }) => (

    <div className="col-xl-15">
        <div className="card contact-sidebar">
            <h5>Basic Information</h5>
            <ul className="basic-info">
                <li>
                    <span><Mail size={15} /></span>
                    <p>{company.email}</p>
                </li>
                <li>
                    <span><Phone size={15} /></span>
                    <p>{company.phone_number}</p>
                </li>
                <li>
                    <span><Calendar size={15} /></span>
                    <p>Created on {new Date(company.created_at).toLocaleDateString()}</p>
                </li>
            </ul>
        <div className='contact-sidebar'>
        <h5>Other Information</h5>
            <ul className="other-info">
                <li><span className="other-title">Language</span><span>Language</span></li>
                <li><span className="other-title">Currency</span><span>United States dollar</span></li>
                <li><span className="other-title">Last Modified</span><span>{new Date(company.updated_at).toLocaleDateString()}</span></li>
                <li><span className="other-title">Source</span><span>Paid Campaign</span></li>
            </ul>
        </div>
        <div className='contact-sidebar'>
        <h5>Tags</h5>
            <ul className="tag-info">
                <li>
                    <Link to="#" className="bg-success-light">Collab</Link>
                </li>
                <li>
                    <Link to="#" className="bg-warning-light">Rated</Link>
                </li>
            </ul>
        </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
                <h5>Company</h5>
                <Link to="#" className="com-add" data-bs-toggle="modal" data-bs-target="#add_contact"><i className="las la-plus-circle me-1" />Add New</Link>
            </div>
            <ul className="company-info com-info">
                <li>
                    <div>
                    <span><img src={company.profile_image || 'default-image-path'} alt="companyicon" /></span>
                    </div>
                    <div>
                        <h6>{company.name}</h6>
                    </div>
                </li>
            </ul>
            <h5>Social Profile</h5>
            <ul className="social-info">
                <li><Link to={company.facebook}><i className="fa-brands fa-youtube" /></Link></li>
                <li><Link to={company.twitter}><i className="fa-brands fa-facebook-f" /></Link></li>
                <li><Link to={company.instagram}><i className="fa-brands fa-instagram" /></Link></li>
                <li><Link to="#"><i className="fa-brands fa-whatsapp" /></Link></li>
                <li><Link to="#"><i className="fa-brands fa-pinterest" /></Link></li>
                <li><Link to={company.linkedin}><i className="fa-brands fa-linkedin" /></Link></li>
            </ul>
        </div>
    </div>
);

export default ContactSidebar;