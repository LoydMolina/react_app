import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Input } from 'antd';
import { useAuth } from '../../../AuthContext';
import { updateCompany } from '../../../apiService';


const CompanyUser = ({ company }) => {
    const addresses = company.addresses || [];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notes, setNotes] = useState(company.notes || '');
    const { authState } = useAuth();
    const userId = authState.user_id;
 
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async (values) => {
        const updatedNotes = values.notes || '';  
        const updatedCompanyData = { ...company, notes: updatedNotes };

        try {
            await updateCompany(company.id, updatedCompanyData, authState.token); 
            setIsModalVisible(false);
            setNotes(updatedNotes);  
            console.log("Notes updated successfully", userId);
        } catch (error) {
            console.error("Error updating notes", error);
        }
    };

    return (
        <div className="col-md-12">
            <div className="contact-head">
                <div className="row align-items-center">
                    <div className="col-sm-6">
                        <ul className="contact-breadcrumb">
                            <li><Link to="/companies"><i className="las la-arrow-left" /> Companies</Link></li>
                            <li>{company.name}</li>
                        </ul>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                        {/* Optional Pagination */}
                    </div>
                </div>
            </div>
            <div className="contact-wrap">
                <div className="contact-profile">
                    {/* Company Avatar */}
                    <div className="name-user">
                        <h4>{company.name}</h4>
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
                <div className="contacts-action">
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

export default CompanyUser;
