import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditTicket = ({ visible, onClose, onSave, ticket, staffs, companies }) => {
  const [form] = Form.useForm(); // Form instance created using Ant Design's useForm hook

  useEffect(() => {
    if (ticket) {
      form.setFieldsValue(ticket); // Setting form values when ticket prop changes
    } else {
      form.resetFields(); // Resetting form fields when ticket prop is null or undefined
    }
  }, [ticket, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Validating form fields before saving
      const updatedTicket = { ...ticket, ...values };

      // Sending updated ticket data to the server using axios
      const response = await axios.put(`https://wd79p.com/backend/public/api/tickets/${ticket.id}`, updatedTicket);
      
      onSave(response.data); // Callback to handle successful save
      onClose(); // Closing the modal after saving
      message.success('Ticket updated successfully'); // Success message
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        message.error('Failed to update ticket. Please check the input data.');
      } else {
        console.error('Error:', error.message);
        message.error('Failed to update ticket.');
      }
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit Ticket"
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical"> {/* Ensure form instance is passed to the Form component */}
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please enter the subject!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select the priority!' }]}
        >
          <Select>
            <Option value="Emergency">Emergency</Option>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the status!' }]}
        >
          <Select>
            <Option value="New">New</Option>
            <Option value="Open">Open</Option>
            <Option value="Reopened">Reopened</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Closed">Closed</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="assign_staff"
          label="Assigned Staff"
          rules={[{ required: true, message: 'Please select the staff!' }]}
        >
          <Select>
            {staffs.map(staff => (
              <Option key={staff.id} value={staff.id}>
                {staff.first_name} {staff.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="company_id"
          label="Company"
          rules={[{ required: true, message: 'Please select the company!' }]}
        >
          <Select>
            {companies.map(company => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTicket;
