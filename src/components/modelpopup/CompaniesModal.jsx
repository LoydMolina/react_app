import React, { useState, useEffect } from 'react';
import { createCompany, updateCompany } from '../../apiService';
import axios from 'axios';
import { useAuth } from "../../AuthContext";

const CompaniesModal = ({ company, onSave }) => {

  const initialFormData = {
    id: '',
    name: '',
    email: '',
    phone_number: '',
    telephone_number: '',
    website: '',
    about_company: '', 
    status: 'Active',
    profile_image: null, 
    addresses: [
      {
        street_address: '',
        city: '',
        state_province: '',
        zipcode: '',
        country: ''
      }
    ],
    notes: '', 
};

const [formData, setFormData] = useState(initialFormData);
const [errors, setErrors] = useState({});
const { authState } = useAuth();


const fetchCompanyDetails = async (id) => {
  try {
    const response = await axios.get(`https://wd79p.com/backend/public/api/companies/${id}`);
    const companyData = response.data;
    
    setFormData({
      ...initialFormData,
      ...companyData, 
      addresses: companyData.addresses.length > 0 ? companyData.addresses : initialFormData.addresses
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
  }
};

useEffect(() => {
  if (company && company.id ) {
    fetchCompanyDetails(company.id); 
  } else {
    setFormData(initialFormData); 
  }
}, [company]);


const addAddress = () => {
  setFormData({
      ...formData,
      addresses: [
          ...formData.addresses,
          {
              street_address: '',
              city: '',
              state_province: '',
              zipcode: '',
              country: ''
          }
      ]
  });
};

const removeAddress = (index) => {
  const updatedAddresses = formData.addresses.filter((_, addrIndex) => addrIndex !== index);
  setFormData({
      ...formData,
      addresses: updatedAddresses
  });
};

const handleAddressChange = (e, index) => {
  const { name, value } = e.target;
  const updatedAddresses = [...formData.addresses];
  updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
  setFormData({
      ...formData,
      addresses: updatedAddresses
  });
};

useEffect(() => {
  if (company) {
    setFormData((prevData) => ({
      ...prevData,
      ...company,
      addresses: company.addresses && company.addresses.length > 0 ? company.addresses : initialFormData.addresses,
      notes: company.notes || '',
      profile_image: null 
    }));
  } else {
    setFormData(initialFormData);
  }
}, [company]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
    }
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';

    formData.addresses.forEach((address, index) => {
        if (!address.street_address) newErrors[`street_address_${index}`] = 'Street Address is required';
        if (!address.city) newErrors[`city_${index}`] = 'City is required';
        if (!address.zipcode) newErrors[`zipcode_${index}`] = 'Zipcode is required';
        if (!address.country) newErrors[`country_${index}`] = 'Country is required';
        if (!address.state_province) newErrors[`state_province_${index}`] = 'State/Province is required';
    });

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
      const token = authState.token;
      const payload = {
        ...formData,
        addresses: formData.addresses,
        notes: formData.notes,
        user_id: authState.user_id,
      };

      if (formData.id) {
          await updateCompany(formData.id, payload);
      } else {
          await createCompany(payload);
      }

      onSave();
      setFormData(initialFormData);
      const closeModalButton = document.querySelector('#add_company .btn-close');
      if (closeModalButton) {
          closeModalButton.click();
      }
  } catch (error) {
      console.error('Error saving company:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.errors) {
          setErrors({ submit: error.response.data.errors });
      } else {
          setErrors({ submit: { general: 'An error occurred. Please try again later.' } });
      }
  }
};

  return (
    <div className="modal fade" id="add_company" tabIndex="-1" role="dialog" aria-labelledby="add_company" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{formData.id ? 'Edit Vendor' : 'Add Vendor'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`} name="phone_number" value={formData.phone_number} onChange={handleChange} />
                {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
              </div>
              <div className="form-group">
                <label>Telephone Number</label>
                <input type="text" className="form-control" name="telephone_number" value={formData.telephone_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="text" className='form-control'  name="website" value={formData.website} onChange={handleChange} />
                {/* {errors.website && <div className="text-danger">{errors.website}</div>} */}
              </div>
              <div className="form-group">
                <label>About Vendor</label>
                <textarea className="form-control" name="about_company" value={formData.about_company} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                {formData.addresses.map((address, index) => (
                  <div key={index} className="address-section">
                    <h6>Address {index + 1}</h6>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input 
                      type="text" 
                      className="form-control" 
                      name="street_address" 
                      value={address.street_address} 
                      onChange={(e) => handleAddressChange(e, index)} />
                      {errors[`street_address_${index}`] && <div className="text-danger">{errors[`street_address_${index}`]}</div>}
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" className="form-control" name="city" 
                            value={address.city} onChange={(e) => handleAddressChange(e, index)} />
                      {errors[`city_${index}`] && <div className="text-danger">{errors[`city_${index}`]}</div>}
                    </div>
                    <div className="form-group">
                      <label>State/Province</label>
                      <input type="text" className="form-control" name="state_province" 
                            value={address.state_province} onChange={(e) => handleAddressChange(e, index)} />
                      {errors[`state_province_${index}`] && <div className="text-danger">{errors[`state_province_${index}`]}</div>}
                    </div>
                    <div className="form-group">
                      <label>Zipcode</label>
                      <input type="text" className="form-control" name="zipcode" 
                            value={address.zipcode} onChange={(e) => handleAddressChange(e, index)} />
                      {errors[`zipcode_${index}`] && <div className="text-danger">{errors[`zipcode_${index}`]}</div>}
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" className="form-control" name="country" 
                            value={address.country} onChange={(e) => handleAddressChange(e, index)} />
                      {errors[`country_${index}`] && <div className="text-danger">{errors[`country_${index}`]}</div>}
                    </div>
                    {/* Button to remove this address */}
                    <button type="button" className="btn btn-danger" onClick={() => removeAddress(index)} disabled={formData.addresses.length === 1}>
                      Remove Address
                    </button>
                    <hr />
                  </div>
                ))}

                {/* Button to add a new address */}
                <button type="button" className="btn btn-secondary" onClick={addAddress}>
                  Add Address
                </button>
                </div>
              <div className="form-group">
                <label>Facebook</label>
                <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input type="text" className="form-control" name="twitter" value={formData.twitter} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input type="text" className="form-control" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Skype</label>
                <input type="text" className="form-control" name="skype" value={formData.skype} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="text" className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" name="notes" 
                          value={formData.notes} onChange={handleChange} />
              </div>

              {/* <div className="form-group">
                <label>Status</label>
                <select className={`form-control ${errors.status ? 'is-invalid' : ''}`} name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="text-danger">{errors.status}</div>}
              </div> */}
              {/* <div className="form-group">
                <label>Profile Image</label>
                <input type="file" className="form-control" name="profile_image" onChange={handleChange} />
              </div> */}
              {errors.submit && <div className="text-danger">{errors.submit.general}</div>}
              <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>{formData.id ? 'Update Company' : 'Add Company'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesModal;
