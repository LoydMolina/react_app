import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditUseModal = ({ visible, onClose, onSave, user}) => {
const [form] = Form.useForm();
const [companies, setCompanies] = useState([]);

useEffect(() => {
  fetchCompanies();
  if (user) {
    form.setFieldsValue(user);
  } else {
    form.resetFields();
  }
}, [user, form]);

const fetchCompanies = async () => {
  try {
    const response = await axios.get('https://wd79p.com/backend/public/api/companies');
    setCompanies(response.data); 
  } catch (error) {
    console.error('Failed to fetch companies:', error.message);
    message.error('Failed to fetch companies.');
  }
};

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...user, ...values };

      console.log('Updated User Data:', updatedUser); 

      const response = await axios.put(`https://wd79p.com/backend/public/api/users/${user.id}`, updatedUser);
      onSave(updatedUser);
      onClose();
      message.success('User updated successfully');
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        message.error('Failed to update user. Please check the input data.');
      } else {
        console.error('Error:', error.message);
        message.error('Failed to update user.');
      }
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit User"
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter the first name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter the last name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter the username!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter the email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter the phone number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="company_id" label="Company" rules={[{ required: true, message: 'Please select the company!' }]}>
        <Select>
            {companies.map(company => (
              <Option key={company.id} value={company.id}>{company.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUseModal;
