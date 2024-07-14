import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Modal, Button, Form, Input, DatePicker, message } from "antd";
import moment from 'moment';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record) => {
    navigate(`/contact-details/${record.id}`, { state: { contact: record } });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddContact = async (values) => {
    values.date_of_birth = values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null;
    try {
      await axios.post('https://wd79p.com/backend/public/api/contacts', values);
      fetchContacts();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://wd79p.com/backend/public/api/contacts/${id}`);
      message.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      message.error('Error deleting contact');
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this contact?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteContact(id),
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "first_name",
      render: (text, record) => (
        <Link
          to={{
            pathname: `/contact-details/${record.id}`,
            state: { contact: record }
          }}
        >
          {`${record.first_name} ${record.last_name}`}
        </Link>
      ),
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "State/Province",
      dataIndex: "state_province",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-end" onClick={(e) => e.stopPropagation()}>
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_contact"
              onClick={() => console.log("Edit contact action", record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
              onClick={() => confirmDelete(record.id)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div>
            <h1>Contacts</h1>
              <ul>
                Dashboard/Contacts
              </ul>
          </div>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Button type="primary" onClick={showModal} style={{ backgroundColor: '#FF902F', borderColor: '#FF902F' }}>
              + Add Contact
            </Button>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={contacts}
                  loading={loading}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' },
                    className: 'table-row-hover'
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddContactModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onAdd={handleAddContact}
        form={form}
      />
    </>
  );
};

const AddContactModal = ({ visible, onCancel, onAdd, form }) => {
  return (
    <Modal
      open={visible}
      title="Add Contact"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onAdd(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_contact_form"
      >
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: 'Please input the first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: 'Please input the last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="job_title"
          label="Job Title"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="company"
          label="Company"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Phone Number"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="street_address"
          label="Street Address"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="state_province"
          label="State/Province"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="country"
          label="Country"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="zipcode"
          label="Zipcode"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="facebook"
          label="Facebook"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="twitter"
          label="Twitter"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="linkedin"
          label="LinkedIn"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="instagram"
          label="Instagram"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="skype"
          label="Skype"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="whatsapp"
          label="Whatsapp"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactsList;
