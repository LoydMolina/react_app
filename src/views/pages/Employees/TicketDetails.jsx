import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, Upload, Tabs, Input,  Modal, Card, Select } from 'antd';
import { useAuth } from '../../../AuthContext'; 
import './TicketDetails.css' 

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const TicketDetails = () => {
    const { id } = useParams();
    const { authState } = useAuth();  
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const [attachmentName, setAttachmentName] = useState(null); 
    const [replies, setReplies] = useState([]);
    const [staffs, setUser] = useState([]);
    const [companyName, setCompanyName] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReply, setSelectedReply] = useState(null);
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [replyText, setReplyText] = useState('');
    const [noteText, setNoteText] = useState('');
    const [file, setFile] = useState([]);
      
    useEffect(() => {
        const fetchTicketDetails = async () => {
            setLoading(true);  
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}`);
                const ticketData = response.data;
                
                setTicket(ticketData);  
                setStatus(ticketData.status); 
                setPriority(ticketData.priority);  
    
                if (ticketData && ticketData.replies && ticketData.company_id) {
                    setReplies(ticketData.replies);  
                    
                    const companyResponse = await axios.get(`https://wd79p.com/backend/public/api/companies/${ticketData.company_id}`);
                    setCompanyName(companyResponse.data.name);
                }
    
                // Fetch files with error handling for 404
                try {
                    const fileResponse = await axios.get(`https://wd79p.com/backend/public/api/get-files/${id}`);
                    const files = fileResponse.data.files;
    
                    if (files.length > 0) {
                        const ticketFiles = files.map(file => ({
                            id: file.id,
                            ticketId: file.ticket_id,
                            replyId: file.reply_id,
                            filePath: file.file_path,
                            createdAt: file.created_at,
                            updatedAt: file.updated_at
                        }));
    
                        setFile(ticketFiles);  
                    } else {
                        setFile([]);  
                    }
                } catch (fileError) {
                    if (fileError.response && fileError.response.status === 404) {
                        setFile([]);  
                    } else {
                        throw fileError;  
                    }
                }
    
                setLoading(false);  
            } catch (error) {
                setError(error.message || "Error fetching ticket details");
                setLoading(false);  
            }
        };
    
        fetchTicketDetails();
    }, [id]);
    
    
    

    const handleStatusChange = async (value) => {
        setStatus(value);

        try {
            const response = await axios.put(`https://wd79p.com/backend/public/api/tickets/${id}`, {
                status: value,
            });

            if (response.status === 200) {
                alert('Status updated successfully');
                fetchActivities();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handlePriorityChange = async (value) => {
        setPriority(value);

        try {
            const response = await axios.put(`https://wd79p.com/backend/public/api/tickets/${id}`, {
                priority: value,
            });

            if (response.status === 200) {
                alert('Priority updated successfully');
                fetchActivities();
            } else {
                alert('Failed to update priority');
            }
        } catch (error) {
            console.error('Error updating priority:', error);
            alert('Failed to update priority');
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}/activities`);
            setActivities(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (ticket) {
            fetchActivities();
        }
    }, [id, ticket]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}/notes`);
            setNotes(response.data);
        } catch (error) {
            setError(error);
        }
    };
    
    useEffect(() => {

        fetchNotes();
    }, [id]);

    const handleFileChange = (info) => {
        const file = info.file; 
        setAttachment(file); 
        setAttachmentName(file.name); 
    };

    const handleReply = async () => {
        if (!replyText) {
            alert('Reply message cannot be empty');
            return;
        }
    
        setLoading1(true);
    
        try {
            const formData = new FormData();
            formData.append('user_id', authState.user_id);  
            formData.append('message', replyText); 
    
            if (attachment) {
                
                formData.append('files[0]', attachment);  
            }
    
            const response = await axios.post(
                `https://wd79p.com/backend/public/api/tickets/${id}/reply`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',  
                    }
                }
            );
    
            if (response.status === 201) {
                alert('Reply submitted successfully');
                fetchActivities();  
                setReplyText(''); 
                setAttachment(null);  
                setAttachmentName(null);  
                fetchReplies();  
            } else {
                alert('Failed to submit reply');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert('Failed to submit reply');
        } finally {
            setLoading1(false);  
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
                const repliesWithAttachments = response.data.replies.map(reply => ({
                    ...reply,
                    attachments: reply.attachments || []  
                }));
                setReplies(repliesWithAttachments);  
            } else {
                setReplies([]); 
            }
        } catch (error) {
            console.error('Failed to fetch replies:', error);
        }
    };
    

    const handleNote = async () => {
        if (!noteText) {
            alert('Note cannot be empty');
            return;
        }
        setLoading1(true); 
        try {
            const response = await axios.post(`https://wd79p.com/backend/public/api/tickets/${id}/notes`, {
                content: noteText,
                user_id: authState.user_id,
            });
    
            if (response.status === 201 || response.status === 200) {
                alert('Note saved successfully');
    
                setNoteText('');
                fetchActivities();
                fetchNotes();  
            } else {
                alert(`Failed to save note. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving note:', error);
    
            if (error.response && error.response.data) {
                alert(`Failed to save note: ${error.response.data.message}`);
            } else {
                alert('Failed to save note. Please try again.');
            }
        }
        finally {
            setLoading1(false); 
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
            title: 'Subject',
            dataIndex: 'subject_type',
            key: 'subject_type',
            render: (subjectType) => {
                const parts = subjectType.split('\\'); 
                return parts[parts.length - 1]; 
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        // {
        //     title: 'Attachments',
        //     dataIndex: 'file',
        //     key: 'file',
        //     render: (file) => (
        //         file ? (
        //             <a href={`https://wd79p.com/backend/${file}`} target="_blank" rel="noopener noreferrer">
        //                 Download File
        //             </a>
        //         ) : null
        //     ),
        // },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).format('MMMM DD, YYYY [at] h:mma'),
        },
    ];

    const containerStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
    };

    const formatMessage = (message) => {
        return message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    };
    

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
                <div style={containerStyle}>
                    <h1>{ticket.subject}</h1>
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
                                        <div className="col-lg-6">
                                            <h6>Status:</h6>
                                            <Select value={status} onChange={handleStatusChange} style={{ width: '140px' }}>
                                                <Option value="New">New</Option>
                                                <Option value="In Progress">In Progress</Option>
                                                <Option value="To Be Followed Up">To Be Followed Up</Option>
                                                <Option value="Estimate Sent">Estimate Sent</Option>
                                                <Option value="Purchased Order">Purchased Order</Option>
                                                <Option value="Solved">Solved</Option>
                                                <Option value="Closed">Closed</Option>
                                            </Select>
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
                                            <h6>To Email</h6>
                                            {ticket.to_email}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    {/* <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-success-lights">
                                            <i className="la la-calendar-check-o" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Created Date</h6>
                                            {moment(ticket.created_at).format('MMMM DD, YYYY')}
                                        </div>
                                    </div> */}
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-success-lights">
                                            <i className="la la-calendar-check-o" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Updated Date</h6>
                                            {moment(ticket.updated_at).format('MMMM DD, YYYY')}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-purple-lights">
                                            <i className="la la-info-circle" />
                                        </span>
                                        <div className="col-lg-6">
                                            <h6>Priority</h6>
                                            <Select value={priority} onChange={handlePriorityChange} style={{ width: '140px' }}>
                                                <Option value="Emergency">Emergency</Option>
                                                <Option value="High">High</Option>
                                                <Option value="Medium">Medium</Option>
                                                <Option value="Low">Low</Option>
                                                
                                            </Select>
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
                            </div>
                        </div>
                        
                        <div className="ticket-detail-tabs">
                            <Tabs defaultActiveKey="1" className="nav nav-tabs">
                                <TabPane tab="Messages" key="1">
                                    <div className="ticket-reply-box">
                                        <div className="ticket-reply-head">
                                            
                                        </div>
                                        
                                        <div className="ticket-reply-footer">
                                            <div className="ticket-reply-form">
                                            <TextArea
                                                id="replies"
                                                rows={4}
                                                placeholder="Reply here..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                                <div className="ticket-attachment">
                                                    <Button 
                                                        style={{ backgroundColor: '#FF902F', borderColor: '#FF902F', margin: '5px'}}
                                                        type="primary" 
                                                        onClick={handleReply}
                                                        disabled={loading1}
                                                    >
                                                        {loading1 ? 'Sending...' : 'Send'}
                                                    </Button>

                                                    <Upload
                                                        onChange={handleFileChange} 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                    >
                                                        <Button>Attach File</Button>
                                                    </Upload>

                                                    
                                                    {attachmentName && <span>{attachmentName}</span>}
                                                </div>

                                            </div>
                                        </div>
                                        <div className="ticket-reply-body">
                                        <div className="ticket-reply-list">
                                            {replies
                                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                .map(reply => (
                                                    <div key={reply.id} className="ticket-reply-thread">
                                                        <div className="ticket-reply-card">
                                                            <div className="ticket-reply-content">
                                                                <div className="ticket-reply-info">
                                                                    <h6>
                                                                        {staffs[reply.user_id]?.first_name} {staffs[reply.user_id]?.last_name}
                                                                    </h6>
                                                                    <h7 className="ticket-reply-time">
                                                                        {moment(reply.created_at).format('MMMM DD, YYYY [at] h:mma')}
                                                                    </h7>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display: '',
                                                                        justifyContent: '',
                                                                        alignItems: '',
                                                                        backgroundColor: '#F2F2F2',
                                                                        padding: '25px',
                                                                        marginLeft: '15px'
                                                                    }}
                                                                >
                                                                    <p dangerouslySetInnerHTML={{ __html: formatMessage(reply.message) }}></p>
                                                                </div>
                                                                {reply.attachments && reply.attachments.length > 0 && (
                                                                    <div className="ticket-attachment">
                                                                        <h6>Attachments:</h6>
                                                                        <ul>
                                                                            {reply.attachments.map(attachment => {
                                                                                const fileUrl = `https://wd79p.com/backend/public/storage/${attachment.file_path}`;
                                                                                const isImage = attachment.file_path.match(/\.(jpeg|jpg|gif|png)$/i); 
                                                                                
                                                                                return (
                                                                                    <li key={attachment.id}>
                                                                                        {isImage ? (
                                                                                            <div>
                                                                                                <img
                                                                                                    src={fileUrl}
                                                                                                    alt={attachment.file_path.split('/').pop()}
                                                                                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                                                                                />
                                                                                                <a
                                                                                                    href={fileUrl}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                >
                                                                                                    {attachment.file_path.split('/').pop()} 
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <a
                                                                                                href={fileUrl}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                            >
                                                                                                {attachment.file_path.split('/').pop()} 
                                                                                            </a>
                                                                                        )}
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    </div>
                                </TabPane>
                                <TabPane tab="Notes" key="2">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-lg-12">

                                                <TextArea
                                                    id="noteTextArea"
                                                    rows="5"
                                                    placeholder="Enter your note..."
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                />
                                                <div className="d-flex align-items-center">
                                                    <Button
                                                        type="primary"
                                                        onClick={handleNote}
                                                        style={{ backgroundColor: '#FF902F', borderColor: '#FF902F', margin: '5px'}}
                                                        disabled={loading1}>
                                                        {loading1 ? 'Sending...' : 'Send'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ticket-reply-body">
                                        <div className="ticket-reply-list">
                                            {notes.map((note, index) => (
                                                <div key={index} className="ticket-reply-thread">
                                                    <div className="ticket-reply-card">
                                                        <div className="ticket-reply-content">
                                                            <div className="ticket-reply-info">
                                                                <span className="ticket-author-name">
                                                                    <strong>{staffs[note.user_id]?.first_name} {staffs[note.user_id]?.last_name}</strong>
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="ticket-time">
                                                                    {moment(note.created_at).format('MMMM DD, YYYY [at] h:mma')}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: '', justifyContent: '', alignItems: '', backgroundColor: '#F2F2F2', padding: '25px', marginLeft: '15px' }}>
                                                                <p dangerouslySetInnerHTML={{ __html: formatMessage(note.content) }}></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5 ms-auto" style={{flex: 1}}>
                        <div className="theiaStickySidebar">
                        <Card title="Activities" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {activities.map((activity, index) => {
                                const user = staffs[activity.user_id];
                                const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
                                const subjectParts = activity.subject_type.split('\\');
                                const subject = subjectParts[subjectParts.length - 1];
                                const action = activity.action;
                                const date = moment(activity.created_at).format('MMMM DD, YYYY [at] h:mma');

                                return (
                                    <div key={index} style={{ marginBottom: '10px' }}>
                                        <strong>{userName}</strong> {action} on <strong>{subject}</strong> at {date}
                                    </div>
                                );
                            })}
                        </Card>

                        </div>
                        <Card title="Attached Files" style={{marginTop:'20px'}}>
                            <div className="row">
                                <div className="col-xxl-6">
                                    <div className="attached-files">
                                    <ul>
                                        <h4>Files</h4>
                                        {file && file.length > 0 ? (
                                            file.map((ticketFile) => (
                                            <li key={ticketFile.id}>
                                                <a
                                                href={`https://wd79p.com/backend/public/storage/${ticketFile.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                >
                                                {ticketFile.filePath.split('/').pop()} {ticketFile.createdAt}
                                                </a>
                                            </li>
                                            ))
                                        ) : (
                                            <li>No Files Attached</li>
                                        )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-7">
                    <Card 
                    title='Description'
                    style={{marginTop:'20px', position: 'relative', padding:'10px'}}
                        >
                        <h6 style={{marginLeft:'30px'}}>{ticket.description}</h6>
                    </Card>
                </div>
            </div>

            <Modal
                title="Reply Details"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                {selectedReply && (
                    <div>
                        <p><strong>Sender:</strong> {staffs[selectedReply.user_id]?.first_name} {staffs[selectedReply.user_id]?.last_name}</p>
                        <p><strong>Date:</strong> {moment(selectedReply.created_at).format('MMMM DD, YYYY [at] h:mma')}</p>
                        <p><strong>Message:</strong> {selectedReply.message}</p>
                        {selectedReply.file &&
                            <p>
                                <strong>Attachment:</strong> <a href={`https://wd79p.com/backend/${selectedReply.file}`} target="_blank" rel="noopener noreferrer">Download Attachment</a>
                            </p>
                        }
                    </div>
                )}
            </Modal>
        </div>

    );
};

export default TicketDetails;
