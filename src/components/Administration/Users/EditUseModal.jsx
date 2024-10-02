import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditUseModal = ({ visible, onClose, onSave, user }) => {
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState([]);

  const roleOptions = [
    { value: "", label: "--Select Role--" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Agent", label: "Agent" },
  ];

  useEffect(() => {
    fetchCompanies();
    if (user) {
      const userData = {
        ...user,
        username: user.user?.username,
        email: user.user?.email
      };
      form.setFieldsValue(userData);
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = {
        ...user,
        username: values.username,
        email: values.email,
        phone: values.phone,
        first_name: values.first_name,
        last_name: values.last_name,
        role: values.role,
        company_id: values.company_id,
      };
  
      if (values.password) {
        updatedUser.password = values.password; 
      }

      
      if (values.password) {
        updatedUser.user.password = values.password;
      }

      await axios.put(`https://wd79p.com/backend/public/api/users/${user.user_id}`, updatedUser);
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
        <Form.Item name="first_name" value='first_name' label="First Name" rules={[{ required: true, message: 'Please enter the first name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="last_name" value='last_name' label="Last Name" rules={[{ required: true, message: 'Please enter the last name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" value='username' label="Username" rules={[{ required: true, message: 'Please enter the username!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" value='email' label="Email" rules={[{ required: true, message: 'Please enter the email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" value='phone' label="Phone Number" rules={[{ required: true, message: 'Please enter the phone number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" value ='role' label="Role" rules={[{ required: true, message: 'Please select the role!' }]}>
          <Select>
            {roleOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="company_id" value='company_id' label="Company" rules={[{ required: true, message: 'Please select the company!' }]}>
          <Select>
            {companies.map(company => (
              <Option key={company.id} value={company.id}>{company.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length < 6) {
                  return Promise.reject('Password must be at least 6 characters');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Passwords do not match');
              }
            })
          ]}
        >
          <Input.Password placeholder="Confirm new password (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUseModal;
