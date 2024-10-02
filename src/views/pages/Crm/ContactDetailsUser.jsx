import React, { useState } from 'react';
import { Mail } from 'react-feather';
import { Button, Modal, Form, Input } from 'antd';
import { updateContacts } from '../../../apiService';
import { useAuth } from '../../../AuthContext';

const ContactDetailsUser = ({ contact }) => {
    const addresses = contact.addresses || [];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notes, setNotes] = useState(contact.notes || '');
    const { authState } = useAuth();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async (values) => {
        const updatedNotes = values.notes || '';  
        const updatedContactData = { ...contact, notes: updatedNotes }; 

        try {
            await updateContacts(contact.id, updatedContactData, authState.token); 
            setIsModalVisible(false);
            setNotes(updatedNotes);  
            console.log("Notes updated successfully");
        } catch (error) {
            console.error("Error updating notes", error);
        }
    };

    return (
        <div className="col-md-12">
            <div className="contact-head">
                <div className="row align-items-center">
                    <div className="col-sm-6">
                        {/* You can add additional info or actions here */}
                    </div>
                    <div className="col-sm-6 text-sm-end">
                        <div className="contact-pagination">
                            {/* Replace with actual pagination or details if needed */}
                        </div>
                    </div>
                </div>  
            </div>
            <div className="contact-wrap">
                <div className="contact-profile">
                    {/* Uncomment and set a default image if available */}
                    {/* <div className="avatar company-avatar">
                        <img src={contact.profile_image || 'default-image-path'} alt="contacticon" />
                    </div> */}
                    <div className="name-user">
                        <h4>{contact.first_name} {contact.last_name}</h4>
                        <p><Mail /> Email: {contact.email || 'N/A'}</p>
                        <div>
                            <i className="las la-map-marker" />
                            <span>Address:</span>
                            {addresses.length > 0 ? (
                                <ul>
                                    {addresses.map((addr, index) => (
                                        <li key={index}>
                                            {addr.street_address || 'N/A'}, {addr.city || 'N/A'}, {addr.state_province || 'N/A'}, {addr.zipcode || 'N/A'}, {addr.country || 'N/A'}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No addresses available.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="company-action" style={{marginBottom:'200px'}}>
                            <Button type="primary" onClick={showModal}>
                                Add Notes
                            </Button>
                            <Modal 
                                title="Update Notes" 
                                open={isModalVisible} 
                                onCancel={handleCancel} 
                                footer={null}
                            >
                                <Form onFinish={handleOk} initialValues={{ notes: notes || '' }}>
                                    <Form.Item
                                        label="Notes"
                                        name="notes"
                                    >
                                        <Input.TextArea rows={4} placeholder="Enter notes" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Save
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
            </div>
        </div>
    );
};

export default ContactDetailsUser;
