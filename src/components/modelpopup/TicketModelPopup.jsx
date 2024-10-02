import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const TicketModelPopup = ({ ticket, onSave }) => {
  const { authState } = useAuth();
  const userId = authState.user_id;

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
    user_id: userId,
    attachments: [], 
    to_email: '',
    message_id: '',
    created_at: '',
    updated_at: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          axios.get('https://wd79p.com/backend/public/api/users', {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }),
          axios.get('https://wd79p.com/backend/public/api/companies', {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }),
        ]);
        setUsers(usersResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authState?.token]);

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData(initialFormData);
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size > 10485760) {
      setFileError('File size exceeds limit (10MB)');
    } else {
      console.log('File selected:', selectedFile);
      setFile(selectedFile);
      setFileError('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.company_id) newErrors.company_id = 'Client is required';
    if (!formData.assign_staff) newErrors.assign_staff = 'Assign Staff is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.cc) {
      newErrors.cc = 'Cc is required';
    } else {
      if (/[^,\s\w@.-]/.test(formData.cc)) {
        newErrors.cc = 'Use commas to separate multiple email addresses';
      } else {
        const emails = formData.cc.split(',').map(email => email.trim());
        const invalidEmails = emails.filter(email => !/\S+@\S+\.\S+/.test(email));
    
        if (invalidEmails.length > 0) {
          newErrors.cc = 'One or more email addresses are invalid';
        }
      }
    }    
    if (!formData.to_email) {
      newErrors.to_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.to_email)) {
      newErrors.to_email = 'Email is invalid';
    }
    if (!formData.description) newErrors.description = 'Description is required';
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

    const formDataToSend = new FormData();
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('company_id', formData.company_id);
    formDataToSend.append('assign_staff', formData.assign_staff);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('cc', formData.cc);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('user_id', formData.user_id);
    formDataToSend.append('to_email', formData.to_email);
    formDataToSend.append('status', formData.status);

    
    if (file) {
      formDataToSend.append('attachments[0]', file);
    }

    try {
      let response;
      if (formData.id) {
        response = await axios.put(
          `https://wd79p.com/backend/public/api/tickets/${formData.id}`,
          formDataToSend, authState.user_id
        );
      } else {
        response = await axios.post(
          'https://wd79p.com/backend/public/api/tickets',
          formDataToSend
        );
        setFormData(initialFormData);
        const closeModalButton = document.querySelector('#add_ticket .btn-close');
        if (closeModalButton) {
          closeModalButton.click();
        }
      }
      onSave();
    } catch (error) {
      console.error('Error saving ticket:', error.response ? error.response.data : error.message);
      alert('Failed to save ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeModalHandler = () => {
      setFormData(initialFormData);
      setErrors({});
      setFile(null);
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
                <label>Company</label>
                <select
                  className={`form-control ${errors.company_id ? 'is-invalid' : ''}`}
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                >
                  <option value="">--Select Company--</option>
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
                  <option value="">--Select Priority--</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.priority && <div className="text-danger">{errors.priority}</div>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
              </div>
              <div className="form-group">
                <label>Attach File</label>
                <input
                  type="file"
                  className={`form-control ${fileError ? 'is-invalid' : ''}`}
                  name="attachments"
                  onChange={handleFileChange}
                />
                {fileError && <div className="text-danger">{fileError}</div>}
                {file && (
                  <div>
                    <span>{file.name}</span>
                    <button type="button" className="btn btn-danger btn-sm" onClick={removeFile}>
                      Remove File
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
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
