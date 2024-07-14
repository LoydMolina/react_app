import React from 'react';

const ContactsGrid = ({ contacts }) => {
  return (
    <div className="row">
      {contacts.map((contact) => (
        <div key={contact.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  {/* Assuming `profile_image` exists in your API response */}
                  <img src={contact.profile_image || 'default-image-path'} alt="Contact" className="img-fluid" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>{contact.first_name} {contact.last_name}</h5>
                  <p>Job Title: {contact.job_title}</p>
                  <p>Company: {contact.company}</p>
                  <p>Email: {contact.email}</p>
                  <p>Phone Number: {contact.phone_number}</p>
                  <p>City: {contact.city}</p>
                  <p>State/Province: {contact.state_province}</p>
                  <p>Country: {contact.country}</p>
                  <p>Status: {contact.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsGrid;
