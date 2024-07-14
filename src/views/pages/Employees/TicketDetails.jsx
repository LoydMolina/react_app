import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, Upload, Tabs, Input, Table, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../../AuthContext';  // Adjust the path as necessary

const { TextArea } = Input;
const { TabPane } = Tabs;

const TicketDetails = () => {
    const { id } = useParams();
    const { authState } = useAuth();  
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const [base64Attachment, setBase64Attachment] = useState(null);
    const [replies, setReplies] = useState([]);
    const [staffs, setUser] = useState([]);
    const [companyName, setCompanyName] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReply, setSelectedReply] = useState(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}`);
                const ticketData = response.data;
                setTicket(ticketData);

                if (ticketData && ticketData.replies && ticketData.company_id) {
                    setReplies(ticketData.replies);
                    const companyResponse = await axios.get(`https://wd79p.com/backend/public/api/companies/${ticketData.company_id}`);
                        setCompanyName(companyResponse.data.name);
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [id]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}/activities`);
                setActivities(response.data);
            } catch (error) {
                setError(error);
            }
        };

        if (ticket) {
            fetchActivities();
        }
    }, [id, ticket]);

    const handleFileChange = (e) => {
        const file = e.file.originFileObj;
        setAttachment(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Attachment(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleReply = async () => {
        const replyText = document.getElementById('replies').value;

        if (!replyText) {
            alert('Reply message cannot be empty');
            return;
        }

        try {
            const response = await axios.post(`https://wd79p.com/backend/public/api/tickets/${id}/reply`, {
                user_id: authState.user_id,  
                message: replyText,
                attachment: base64Attachment,
            });

            if (response.status === 201) {
                alert('Reply submitted successfully');
                

                fetchReplies();
                document.getElementById('replies').value = null;
                setBase64Attachment(null); 
            } else {
                alert('Failed to submit reply');

            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert('Failed to submit reply');
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('https://wd79p.com/backend/public/api/users');
            const users = response.data;
    

            const usersById = {};
            users.forEach(user => {
                usersById[user.user_id] = user;
            });
    
            setUser(usersById);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}`);
            if (response.data && response.data.replies) {
                setReplies(response.data.replies);
            } else {
                setReplies([]); 
            }
        } catch (error) {
            console.error('Failed to fetch replies:', error);
        }
    };

    const handleNote = async () => {
        const noteText = document.getElementById('noteTextArea').value;

        try {
            await axios.post(`https://wd79p.com/backend/public/api/tickets/${id}/note`, {
                text: noteText,
            });
            alert('Note saved successfully');
        } catch (error) {
            alert('Failed to save note');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading ticket details: {error.message}</div>;
    }

    const navigateToTicketPage = () => {
        window.location.href = '/tickets';
    };

    const showModal = (reply) => {
        setSelectedReply(reply);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (user_id) => `${staffs[user_id]?.first_name} ${staffs[user_id]?.last_name}`,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).format('MMMM DD, YYYY [at] h:mma'),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Attachments',
            dataIndex: 'file',
            key: 'file',
            render: (file) => (
                file ? (
                    <a href={`https://wd79p.com/backend/${file}`} target="_blank" rel="noopener noreferrer">
                        Download File
                    </a>
                ) : null
            ),
        },
    ];

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h3 className="page-title mb-0">Ticket Detail</h3>
                        </div>
                        <div className="col-md-8 float-end ms-auto">
                            <div className="d-flex title-head">
                                <Link to="#" className="btn btn-link" onClick={navigateToTicketPage}>
                                    <i className="las la-arrow-left" /> Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="ticket-detail-head">
                            <div className="row">
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon">
                                            <i className="la la-stop-circle" />
                                        </span>
                                        <div className="detail-info">
                                            <h6>Ticket Id</h6>
                                            <span className="badge badge-soft-warning">
                                                {ticket.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon">
                                            <i className="la la-stop-circle" />
                                        </span>
                                        <div className="detail-info">
                                            <h6>Status</h6>
                                            <span className="badge badge-soft-warning">
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-danger-lights">
                                            <i className="la la-user" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Company</h6>
                                            {companyName}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-danger-lights">
                                            <i className="la la-user" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Assigned Staff</h6>
                                            {ticket.assigned_user?.username}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-warning-lights">
                                            <i className="la la-calendar" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Created Date</h6>
                                            <span>
                                                {moment(ticket.created_at).format('MMMM DD, YYYY [at] h:mma')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-purple-lights">
                                            <i className="la la-info-circle" />
                                        </span>
                                        <div className="detail-info">
                                            <h6>Priority</h6>
                                            <span>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ticket-purpose">
                            <h4>{ticket.subject}</h4>
                            <p>{ticket.description}</p>
                        </div>
                        <div className="attached-files-info">
                            <div className="row" style={{ marginTop: '20px' }}>
                                <div className="col-xxl-6">
                                    <div className="attached-files">
                                        <ul>
                                            <h4>Files</h4>
                                            {ticket.file ? (
                                                <li>
                                                    <a href={ticket.file} target="_blank" rel="noopener noreferrer">
                                                        {ticket.file}
                                                    </a>
                                                </li>
                                            ) : (
                                                <li>No Files Attached</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-3"></div>
                        <div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Reply" key="1">
                                    <div className="reply">
                                        <Upload 
                                            onChange={handleFileChange} 
                                            fileList={[]}
                                            beforeUpload={() => false} 
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                        <TextArea 
                                            id="replies" 
                                            rows={4} 
                                            style={{ width: '100%', marginTop: '10px' }} 
                                            placeholder="Type your reply here..."
                                        />
                                        <Button 
                                            type="primary" 
                                            style={{ backgroundColor: '#FF902F', borderColor: '#FF902F', marginTop: '10px' }} 
                                            onClick={handleReply}
                                        >
                                            Reply
                                        </Button>
                                    </div>
                                </TabPane>
                                <TabPane tab="Note" key="2">
                                    <div className="reply">
                                        <TextArea 
                                            id="noteTextArea" 
                                            rows={4} 
                                            style={{ width: '100%', marginTop: '10px' }} 
                                            placeholder="Type your note here..."
                                        />
                                        <Button 
                                            type="primary" 
                                            style={{ backgroundColor: '#FF902F', borderColor: '#FF902F', marginTop: '10px' }} 
                                            onClick={handleNote}
                                        >
                                            Save Note
                                        </Button>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="reply my-5">
                            <div className="reply-info">
                                <h6>Replies</h6>
                                <Table
                                    dataSource={replies}
                                    columns={columns}
                                    onRow={(record) => ({
                                    onClick: () => showModal(record),
                                    })}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5 theiaStickySidebar">
                        <div className='stickybar'>
                            <div className="ticket-chat">
                                <h4>Activity Log</h4>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map(activity => (
                                                <tr key={activity.id}>
                                                    <td>{activity.action}</td>
                                                    <td>{moment(activity.created_at).format('MMMM DD, YYYY [at] h:mma')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Reply Details"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Close
                    </Button>,
                ]}
            >
                {selectedReply && (
                    <div>
                        <p>
                            <strong>User:</strong> {`${staffs[selectedReply.user_id]?.first_name} ${staffs[selectedReply.user_id]?.last_name}`}
                        </p>
                        <p>
                            <strong>Date:</strong>{' '}
                            {moment(selectedReply.created_at).format('MMMM DD, YYYY [at] h:mma')}
                        </p>
                        <p>
                            <strong>Message:</strong> {selectedReply.message}
                        </p>
                        {selectedReply.file_path && (
                            <p>
                                <strong>Attachment:</strong>{' '}
                                <a href={selectedReply.file_path} target="_blank" rel="noopener noreferrer">
                                    Download File
                                </a>
                            </p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TicketDetails;
