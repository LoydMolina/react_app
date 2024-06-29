// TicketFilter.js
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const TicketFilter = ({ onFilterChange }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onFilterChange(values);
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish} className="ticket-filter-form">
      <Form.Item name="id">
        <Input placeholder="Ticket Id" />
      </Form.Item>
      <Form.Item name="companyName">
        <Input placeholder="Company Name" />
      </Form.Item>
      <Form.Item name="subject">
        <Input placeholder="Ticket Subject" />
      </Form.Item>
      <Form.Item name="priority">
        <Select placeholder="Priority" allowClear>
          <Option value="Emergency">Emergency</Option>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </Form.Item>
      <Form.Item name="status">
        <Select placeholder="Status" allowClear>
          <Option value="New">New</Option>
          <Option value="Open">Open</Option>
          <Option value="On Hold">On Hold</Option>
          <Option value="Closed">Closed</Option>
          <Option value="Cancelled">Cancelled</Option>
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

export default TicketFilter;
