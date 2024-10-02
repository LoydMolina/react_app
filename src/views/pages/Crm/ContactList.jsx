import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Modal, Button, Form, Input, DatePicker, message, Row, Col, Card, Select, Tag } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import moment from "moment";
import { useAuth } from "../../../AuthContext";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [editingContact, setEditingContact] = useState(null); 
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm(); 
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredData = contacts.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    if (authState?.token) {
      fetchContacts(); 
    }
    form.setFieldsValue({
      addresses: [], 
    });
  }, [form, authState?.token]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://wd79p.com/backend/public/api/contacts", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
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

  const handleEditClick = async (record) => {
    const contactWithAddresses = await fetchContactById(record.id);
    if (contactWithAddresses) {
      setEditingContact(contactWithAddresses);
      showEditModal(contactWithAddresses);
    }
  };
  
  const showEditModal = (contact) => {
    let tagsString = '';
    
    if (typeof contact.tags === 'string') {
      try {
        const parsedTags = JSON.parse(contact.tags);
        tagsString = Array.isArray(parsedTags) ? parsedTags.join(', ') : contact.tags;
      } catch (error) {
        tagsString = contact.tags;
      }
    } else if (Array.isArray(contact.tags)) {
      tagsString = contact.tags.join(', ');
    }
  
    editForm.setFieldsValue({
      ...contact,
      date_of_birth: contact.date_of_birth ? moment(contact.date_of_birth, "YYYY-MM-DD") : null,
      addresses: contact.addresses || [],
      tags: tagsString,  
    });
  
    setIsEditModalVisible(true);
  };
  

  const fetchContactById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://wd79p.com/backend/public/api/contacts/${id}`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handleAddContact = async (values) => {
    const { addresses = [], tags = '', ...restValues } = values;
    const formattedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const user = authState.user_id;
    if (!Array.isArray(addresses)) {
      console.error("Addresses is not defined or not an array:", addresses);
      return; 
    }
    const formattedAddresses = addresses.map(address => ({
      street_address: address.street_address,
      city: address.city,
      state_province: address.state_province,
      country: address.country,
      zipcode: address.zipcode,
    }));
  
    restValues.date_of_birth = restValues.date_of_birth ? moment(restValues.date_of_birth).format("YYYY-MM-DD") : null;
    restValues.status = "Active";
  
    setLoadingAdd(true);
    try {
      await axios.post("https://wd79p.com/backend/public/api/contacts", {
        ...restValues,
        tags: formattedTags,
        addresses: formattedAddresses,
        user_id: user,
      });
      message.success("Contact added successfully");
      fetchContacts();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding contact:", error);
      message.error("Error adding contact");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEditContact = async (values) => {
    const tagsArray = values.tags ? values.tags.split(",").map(tag => tag.trim()) : [];
  
    const addressData = values.addresses.map(addr => ({
      street_address: addr.street_address,
      city: addr.city,
      state_province: addr.state_province,
      country: addr.country,
      zipcode: addr.zipcode,
    }));
  
    values.date_of_birth = values.date_of_birth ? moment(values.date_of_birth).format("YYYY-MM-DD") : null;
    values.status = "Active";
    values.user_id = authState.user_id;
  
    try {
      await axios.put(`https://wd79p.com/backend/public/api/contacts/${editingContact.id}`, {
        ...values,
        addresses: addressData,
        tags: tagsArray, 
      });
      message.success("Contact updated successfully");
      fetchContacts();
      setIsEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error("Error editing contact:", error);
      message.error("Error updating contact");
    }
  };
  
  

  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://wd79p.com/backend/public/api/contacts/${id}`);
      message.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error("Error deleting contact");
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this contact?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
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
          state: { contact: record },
        }}
      >
        {`${record.first_name}${record.last_name ? ` ${record.last_name}` : ''}`}
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
    {title: 'Website',
      dataIndex: 'website',
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (tags) => {
        try {
          const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');
          return Array.isArray(parsedTags) ? parsedTags.join(', ') : parsedTags;
        } catch (error) {
          console.error('Error parsing tags:', error);
          return tags || ''; 
        }
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text) => moment(text).format("MMMM DD, YYYY [at] h:mma"),
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
              onClick={() => handleEditClick(record)}
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
            <h1>Customers</h1>
            <ul>Dashboard / Customers</ul>
          </div>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Button
              type="primary"
              onClick={showModal}
              loading={loadingAdd}
              style={{ backgroundColor: "#FF902F", borderColor: "#FF902F" }}
            >
              + Add Customer
            </Button>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '16px', padding: '8px', width: '300px' }}
              />
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: "pointer" },
                    className: "table-row-hover",
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddContactModal visible={isModalVisible} onCancel={handleCancel} onAdd={handleAddContact} form={form} />

      {/* Edit Modal */}
      <EditContactModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onEdit={handleEditContact}
        form={editForm}
        contact={editingContact}
      />
    </>
  );
}; 


const ContactFormFields = ({ form }) => (
  <>
    <Card title="Personal Information" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please input the first name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="last_name"
            label="Last Name"
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
          name="email"
          label="Email"
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
          name="phone_number" 
          label="Phone Number"         
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
          name="date_of_birth" 
          label="Date of Birth" 
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
    <Card title="Company Details" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="company" label="Company">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="job_title" label="Job Title">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
    <Card title="Tags" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="tags"
            label="Tags"
          >
            <Input placeholder="Enter tags, separated by commas" style={{width:'300px'}}/>
          </Form.Item>
        </Col>
      </Row>
    </Card>
    <Card title="Address Details" style={{ marginBottom: '20px' }}>
      <Form.List name="addresses">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row gutter={16} key={key}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'street_address']}
                    fieldKey={[fieldKey, 'street_address']}
                    label="Street Address"
                    rules={[{ required: true, message: 'Please input the street address!' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'city']}
                    fieldKey={[fieldKey, 'city']}
                    label="City"
                    rules={[{ required: true, message: 'Please input the city!' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'state_province']}
                    fieldKey={[fieldKey, 'state_province']}
                    label="State/Province"
                    rules={[{ required: true, message: 'Please input the state or province!' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'country']}
                    fieldKey={[fieldKey, 'country']}
                    label="Country"
                    rules={[{ required: true, message: 'Please input the country!' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'zipcode']}
                    fieldKey={[fieldKey, 'zipcode']}
                    label="Zipcode"
                    rules={[{ required: true, message: 'Please input the zipcode!' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    type="danger"
                    onClick={() => remove(name)}
                    style={{ marginTop: '28px' }}
                  >
                    Remove Address
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              style={{ width: '100%', marginTop: '20px' }}
            >
              + Add Address
            </Button>
          </>
        )}
      </Form.List>
    </Card>
    {/* <Card title="Tags" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="tags">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>
    </Card> */}
    <Card title="Social Media Links" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
      <Col span={8}>
          <Form.Item name="website" label="Website">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="facebook" label="Facebook">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="twitter" label="Twitter">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="linkedin" label="LinkedIn">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="instagram" label="Instagram">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="skype" label="Skype">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="whatsapp" label="Whatsapp">
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
    <Card title="Notes" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="notes">
            <Input.TextArea rows={4} placeholder="Enter notes here..." />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  </>
);

const AddContactModal = ({ visible, onCancel, onAdd, form }) => (
  <Modal visible={visible} title="Add Customer" onCancel={onCancel} footer={null}>
    <Form layout="vertical" form={form} onFinish={onAdd}>
      <ContactFormFields form={form} />
      <Form.Item>
      <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Add Customer
          </Button>
        </div>
      </Form.Item>
    </Form>
  </Modal>
);

const EditContactModal = ({ visible, onCancel, onEdit, form, contact }) => (
  <Modal visible={visible} title="Edit Customer" onCancel={onCancel} footer={null}>
    <Form layout="vertical" form={form} onFinish={onEdit}>
      <ContactFormFields form={form} />
      <Form.Item>
      <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Update Customer
          </Button>
        </div>
      </Form.Item>
    </Form>
  </Modal>
);

export default ContactsList;
