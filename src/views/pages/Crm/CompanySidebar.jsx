import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { Calendar, Mail, PhoneCall, Phone } from 'react-feather';

const CompanySidebar = ({ company }) => (

    <div className="col-xl-15">
        <div className="card contact-sidebar">
            <h5>Basic Information</h5>
            <ul className="basic-info">
                <li>
                    <span><Mail size={15} /></span>
                    <p>{company.email}</p>
                </li>
                <li>
                    <span><PhoneCall size={15} /></span>
                    <p>{company.phone_number}</p>
                </li>
                <li>
                    <span><Phone size={15} /></span>
                    <p>{company.telephone_number}</p>
                </li>
                <li>
                    <span><Calendar size={15} /></span>
                    <p>Created on {new Date(company.created_at).toLocaleDateString()}</p>
                </li>
            </ul>
        <div className='contact-sidebar'>
        <h5>Other Information</h5>
            <ul className="other-info">
                {/* <li><span className="other-title">Language</span><span>Language</span></li> */}
                {/* <li><span className="other-title">Currency</span><span>United States dollar</span></li> */}
                <li><span className="other-title">Last Modified</span><span>{new Date(company.updated_at).toLocaleDateString()}</span></li>
                {/* <li><span className="other-title">Source</span><span>Paid Campaign</span></li> */}
            </ul>
        </div>
        {/* <div className='contact-sidebar'>
        <h5>Tags</h5>
            <ul className="tag-info">
                <li>
                    <Link to="#" className="bg-success-light">Collab</Link>
                </li>
                <li>
                    <Link to="#" className="bg-warning-light">Rated</Link>
                </li>
            </ul>
        </div> */}
            <div className='contact-sidebar'>
                <h5>Notes</h5>
                {/* <Link to="#" className="com-add" data-bs-toggle="modal" data-bs-target="#add_contact"><i className="las la-plus-circle me-1" />Add New</Link> */}
                <ul className="other-info">
                <li>
                    {/* <div>
                    <span><img src={company.profile_image || 'default-image-path'} alt="companyicon" /></span>
                    </div> */}
                    <div>
                        <h6>{company.notes}</h6>
                    </div>
                </li>
            </ul>
            </div>
            <Card className="me-4 mb-4" style={{ minWidth: '250px' }}>
                <h5>Social Profiles</h5>
                <ul className="social-info">
                    <li><Link to={company.facebook}><i className="fa-brands fa-facebook-f" /></Link></li>
                    <li><Link to={company.twitter}><i className="fa-brands fa-twitter" /></Link></li>
                    <li><Link to={company.instagram}><i className="fa-brands fa-instagram" /></Link></li>
                    <li><Link to="#"><i className="fa-brands fa-whatsapp" /></Link></li>
                    <li><Link to="#"><i className="fa-brands fa-pinterest" /></Link></li>
                    <li><Link to={company.linkedin}><i className="fa-brands fa-linkedin" /></Link></li>
                </ul>
            </Card>
        </div>
    </div>
);

export default CompanySidebar;