import axios from 'axios';

const API_BASE_URL = 'https://wd79p.com/backend/public/api/companies';
const TICKET_API = 'https://wd79p.com/backend/public/api/tickets';
const CONTACT_API = 'https://wd79p.com/backend/public/api/contacts'; 

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  }
}); 

export const getCompanies = async (token) => {
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompany = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const createCompany = async (companyData, token) => {
  try {
    const response = await axios.post(API_BASE_URL, companyData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id, companyData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, companyData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const updateContacts = async ( contactData, token) => {
  try {
    const response = await axios.put(CONTACT_API, contactData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};
export const createContacts = async (id, contactData, token) => {
  try {
    const response = await axios.put(`${CONTACT_API}/${id}`, contactData, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};
export const deleteContacts = async (id, contactData, token) => {
  try {
    const response = await axios.put(`${CONTACT_API}/${id}`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

export const getTickets = async (token) => {
  try {
    const response = await axios.get(TICKET_API, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getTicket = async (id, token) => {
  try {
    const response = await axios.get(`${TICKET_API}/${id}`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

export const createTicket = (data, token) => {
  return axios.post(`${TICKET_API}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTicket = (id, data, token) => {
  return axios.post(`${TICKET_API}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTicket = async (id, token) => {
  try {
    const response = await axios.delete(`${TICKET_API}/${id}`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};
