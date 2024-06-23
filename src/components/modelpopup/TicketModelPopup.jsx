import React, { useState, useEffect } from 'react';
import { createTicket, updateTicket } from '../../apiService';
import axios from 'axios';



const TicketModelPopup = ({ ticket, onSave }) => {
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://wd79p.com/backend/public/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://wd79p.com/backend/public/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    id: '',
    subject: '',
    company_id:'',
    assign_staff: '',
    priority: '',
    cc: '',
    description: '',
    file: '',
    user_id: '',
    to_email: '',
    message_id: '',
    created_at: '',
    updated_at: '',
    status: 'Active'
  });


  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData({
        id: '',
        subject: '',
        company_id:'',
        assign_staff: '',
        priority: '',
        cc: '',
        description: '',
        file: '',
        user_id: '',
        to_email: '',
        message_id: '',
        created_at: '',
        updated_at: '',
        status: 'Active'
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.to_email) {
      newErrors.to_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.to_email)) {
      newErrors.to_email = 'Email is invalid';
    }
    // if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    // if (!formData.website) {
    //   newErrors.website = 'Website is required';
    // } 
    
    // else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
    //   newErrors.website = 'Website must be a valid URL';
    // }
    // if (!formData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      if (formData.id) {
        await updateTicket(formData.id, formData);
      } else {
        await createTicket(formData);
      }
      onSave();
      // Reset form fields
      setFormData({
        id: '',
        subject: '',
        company_id:'',
        assign_staff: '',
        priority: '',
        cc: '',
        description: '',
        file: '',
        user_id: '',
        to_email: '',
        message_id: '',
        created_at: '',
        updated_at: '',
        status: 'Active'
      });
      // Close modal after save
      const closeModalButton = document.querySelector('#add_ticket .btn-close');
      if (closeModalButton) {
        closeModalButton.click();
      }
    } catch (error) {
      console.error('Error saving ticket:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors({ submit: error.response.data.errors });
      } else {
        setErrors({ submit: { general: 'An error occurred. Please try again later.' } });
      }
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  return (
    <div className="modal fade" id="add_ticket" tabIndex="-1" role="dialog" aria-labelledby="add_ticket" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{formData.id ? 'Edit Ticket' : 'Add Ticket'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ticket Subject</label>
                <input type="text" className={`form-control ${errors.subject ? 'is-invalid' : ''}`} name="subject" value={formData.subject} onChange={handleChange} />
                {errors.name && <div className="text-danger">{errors.subject}</div>}
              </div>
              <div className="form-group">
                <label>Client</label>
                <select
                  className={`form-control ${errors.company_id ? 'is-invalid' : ''}`}
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                >
                  <option value="">--Select Client--</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.company_id && <div className="text-danger">{errors.company_id}</div>}
              </div>
              <div className="form-group">
                <label>Assign Staff</label>
                <select
                  className={`form-control ${errors.assign_staff ? 'is-invalid' : ''}`}
                  name="assign_staff"
                  value={formData.assign_staff}
                  onChange={handleChange}
                >
                  <option value="">--Select Staff--</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                {errors.assign_staff && <div className="text-danger">{errors.assign_staff}</div>}
              </div>
              <div className="form-group">
                <label>Cc</label>
                <input type="text" className={`form-control ${errors.cc ? 'is-invalid' : ''}`} name="cc" value={formData.cc} onChange={handleChange} />
                {errors.website && <div className="text-danger">{errors.cc}</div>}
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className={`form-control ${errors.status ? 'is-invalid' : ''}`} name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.status && <div className="text-danger">{errors.status}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className={`form-control ${errors.to_email ? 'is-invalid' : ''}`} name="to_email" value={formData.to_email} onChange={handleChange} />
                {errors.email && <div className="text-danger">{errors.to_email}</div>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
              </div>
              {errors.submit && (
                <div className="text-danger">
                  {Object.entries(errors.submit).map(([field, messages]) => (
                    <div key={field}>
                      {field}: {Array.isArray(messages) ? messages.join(', ') : messages}
                    </div>
                  ))}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModelPopup;