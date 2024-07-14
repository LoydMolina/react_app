import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserFilter = ({ onFilterChange }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  
  // Fetch users data from the API
  useEffect(() => {
    axios.get('https://wd79p.com/backend/public/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch users data');
        console.error('Error fetching users data:', error);
      });
  }, []);

  const handleFinish = (values) => {
    onFilterChange(values);
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish} className="user-filter-form">
      <Form.Item name="user_id">
        <Select placeholder="User Id" allowClear>
          {users.map(user => (
            <Option key={user.user_id} value={user.user_id}>{user.user_id}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="employee_id">
        <Input placeholder="Employee Id" />
      </Form.Item>
      <Form.Item name="companyName">
        <Input placeholder="Company" />
      </Form.Item>
      <Form.Item name="priority">
        <Select placeholder="Priority" allowClear>
          <Option value="Emergency">Emergency</Option>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </Form.Item>
      <Form.Item name="role">
        <Select placeholder="Role" allowClear>
          <Option value="Admin">Admin</Option>
          <Option value="Employee">Employee</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#FFA500', borderColor: '#FFA500' }}>
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserFilter;
