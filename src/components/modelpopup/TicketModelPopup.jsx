import React, { useState, useEffect } from 'react';
import { createTicket, updateTicket } from '../../apiService';
import axios from 'axios';

const TicketModelPopup = ({ ticket, onSave }) => {
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const initialFormData = {
    id: '',
    subject: '',
    company_id: '',
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
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          axios.get('https://wd79p.com/backend/public/api/users'),
          axios.get('https://wd79p.com/backend/public/api/companies'),
        ]);
        setUsers(usersResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData(initialFormData);
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assign_staff') {
      const selectedUser = users.find(user => user.user_id.toString() === value);
      setFormData({
        ...formData,
        assign_staff: selectedUser ? selectedUser.user_id : '', 
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10485760) { 
        setFileError('File size exceeds limit (10MB)');
        setFile(null);
      } else {
        setFile(selectedFile);
        setFileError('');
      }
    } else {
      setFile(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.company_id) newErrors.company_id = 'Client is required';
    if (!formData.assign_staff) newErrors.assign_staff = 'Assign Staff is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.cc) {
      newErrors.cc = 'Cc is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.cc)) {
      newErrors.cc = 'Email is invalid';
    }
    if (!formData.to_email) {
      newErrors.to_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.to_email)) {
      newErrors.to_email = 'Email is invalid';
    }
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      let fileData = '';
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          fileData = reader.result.split(',')[1]; 
          submitForm(fileData);
        };
      } else {
        submitForm(fileData);
      }
    } catch (error) {
      console.error('Error saving ticket:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors({ submit: error.response.data.errors });
      } else {
        setErrors({ submit: { general: 'An error occurred. Please try again later.' } });
      }
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (fileData) => {
    try {
      const formDataWithFile = { ...formData, file: fileData };
      if (formData.id) {
        await updateTicket(formData.id, formDataWithFile);
      } else {
        await createTicket(formDataWithFile);
      }
      onSave();
      setFormData(initialFormData);
      setFile(null);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeModalHandler = () => {
      setFormData(initialFormData);
      setErrors({});
    };

    const modalElement = document.getElementById('add_ticket');
    modalElement.addEventListener('hidden.bs.modal', closeModalHandler);

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', closeModalHandler);
    };
  }, []);

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
                <input
                  type="text"
                  className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <div className="text-danger">{errors.subject}</div>}
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
                  {companies.map((company) => (
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
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                {errors.assign_staff && <div className="text-danger">{errors.assign_staff}</div>}
              </div>
              <div className="form-group">
                <label>Cc</label>
                <input
                  type="text"
                  className={`form-control ${errors.cc ? 'is-invalid' : ''}`}
                  name="cc"
                  value={formData.cc}
                  onChange={handleChange}
                />
                {errors.cc && <div className="text-danger">{errors.cc}</div>}
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Emergency">Emergency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.priority && <div className="text-danger">{errors.priority}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.to_email ? 'is-invalid' : ''}`}
                  name="to_email"
                  value={formData.to_email}
                  onChange={handleChange}
                />
                {errors.to_email && <div className="text-danger">{errors.to_email}</div>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
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
                <div className="form-group">
                <label>Attachment</label>
                <input
                  type="file"
                  className={`form-control-file ${fileError ? 'is-invalid' : ''}`}
                  onChange={handleFileChange}
                />
                {fileError && <div className="text-danger">{fileError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
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
