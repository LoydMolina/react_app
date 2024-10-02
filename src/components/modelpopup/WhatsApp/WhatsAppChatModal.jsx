import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Input, message as antdMessage, List, Upload, Form } from 'antd';
import './WhatsAppChatModal.css';
import { useAuth } from '../../../AuthContext';
import { format } from 'date-fns';

const WhatsAppChatModal = ({ visible, onClose, onUnreadMessagesUpdate  }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: '', phone: '' });
  const [existingContacts, setExistingContacts] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { authState } = useAuth();
  const senderNumber = '639773887500';
  const chatContainerRef = useRef(null);

useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [messages]);

  useEffect(() => {
    if (visible) {
      fetchReceivers();
      fetchExistingContacts();
    }
  }, [visible]);

  const fetchExistingContacts = async () => {
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/contacts');
      if (response.data && Array.isArray(response.data)) {
        setExistingContacts(response.data.map(contact => contact.whatsapp));
      } else {
        console.error('Unexpected response format:', response.data);
        antdMessage.error('Failed to fetch existing contacts');
      }
    } catch (error) {
      console.error('Error fetching existing contacts:', error);
      antdMessage.error('Failed to fetch existing contacts');
    }
  };

  const fetchUserDetails = async (reply_by) => {
    try {
      const response = await axios.get(`https://wd79p.com/backend/public/api/users/${reply_by}`);
      if (response.data) {
        const { first_name, last_name } = response.data;
        return `${first_name} ${last_name}`;
      } else {
        console.error('Unexpected user data format:', response.data);
        return 'Unknown User';
      }
    } catch (error) {
      // console.error('Error fetching user details:', error);
      return 'Unknown User';
    }
  };

  const fetchReceivers = async () => {
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/wa_contacts');
      // console.log('Receivers API response:', response.data);
  
      if (response.data && Array.isArray(response.data.WhatsappContacts)) {
        const contacts = response.data.WhatsappContacts.map(contact => ({
          first_name: contact.first_name,
          phone: contact.phone
        }));
  
        setReceivers(contacts);
        setSelectedReceiver(contacts[0]); 
      } else {
        console.error('Unexpected response format:', response.data);
        antdMessage.error('Unexpected response format from the server');
      }
    } catch (error) {
      console.error('Error fetching receivers:', error);
      antdMessage.error('Failed to fetch receivers');
    }
  };
  

  useEffect(() => {
    let intervalId;
  
    if (selectedReceiver) {
      // Fetch messages immediately when the receiver is selected
      fetchMessages(selectedReceiver);
  
      // Set up polling to fetch messages every 5 seconds
      intervalId = setInterval(() => {
        fetchMessages(selectedReceiver, false); // Pass `false` to avoid showing the loading state repeatedly
      }, 5000);
    }
  
    // Clear the interval when the component unmounts or when the receiver changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedReceiver]);

  const fetchMessages = async (receiver, setLoadingState = true) => {
    if (setLoadingState) setLoading(true);
    
    try {
      const response = await axios.get(`https://wd79p.com/backend/public/api/webhook/${receiver.phone}`);
  
      if (response.data && Array.isArray(response.data.WhatsappData)) {
        const fetchedMessages = await Promise.all(response.data.WhatsappData
          .filter(item => item.wa_receiver === receiver.phone || item.wa_sender === receiver.phone)
          .map(async (item) => {
            let messageBody = '';
            let fileType = '';
            const seenStatus = item.seen_status;
  
            try {
              const jsonText = JSON.parse(item.json_text);
  
              if (item.wa_type === 'document' && jsonText[0]?.document) {
                messageBody = jsonText[0].document.filename || 'Document';
                fileType = 'document';
              } else if (item.wa_type === 'text') {
                messageBody = item.body_text || 'Text message';
              } else if (Array.isArray(jsonText.messages)) {
                messageBody = jsonText.messages.map(msg => msg.text?.body).join(' ');
              }
            } catch (error) {
              console.error('Error parsing json_text:', error);
              messageBody = item.body_text || 'Error parsing message';
            }
  
            const senderName = item.reply_by ? await fetchUserDetails(item.reply_by) : 'Unknown Sender';
  
            return {
              id: item.id,
              type: item.wa_type,
              senderName: senderName,
              sender: item.wa_sender,
              receiver: item.wa_receiver,
              reply_by: item.reply_by,
              timestamp: format(new Date(item.wa_timestamp), 'MM/dd/yyyy hh:mm a'),
              message: messageBody,
              fileName: item.file_name,
              fileType: item.file_name ? item.file_name.split('.').pop() : fileType,
              seen_status: seenStatus,
            };
          })
        );
        
        const unseenCount = fetchedMessages.filter(msg => msg.seen_status === 0).length;
        setUnseenMessages(prev => ({
          ...prev,
          [receiver.phone]: unseenCount > 0
        }));
  
        onUnreadMessagesUpdate(unseenCount > 0);
        setMessages(fetchedMessages);
  
      } else {
        console.error('Unexpected response format:', response.data);
        antdMessage.error('Unexpected response format from the server');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      antdMessage.error('Failed to fetch messages');
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  const handleMessageClick = (id) => {
    markAsSeen(id);
  };

  const markAsSeen = async (id) => {
    try {
      await axios.post(`https://wd79p.com/backend/public/api/wa-jsons/${senderNumber}/mark-as-read`, {
      });
      await axios.post(`https://wd79p.com/backend/public/api/wa-jsons/${id}/mark-as-read`, {
      });
  
      setUnseenMessages(prev => ({ ...prev, [id]: false }));
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === id ? { ...message, see_status: 1 } : message
        )
      );
      
      // antdMessage.success('Message marked as read');
    } catch (error) {
      console.error('Error marking messages as seen:', error);
      antdMessage.error('Failed to mark messages as seen');
    }
  };
  
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    if (!selectedReceiver) {
      antdMessage.error('No receiver selected. Please select a receiver to send a message.');
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
  
      const messageBody = newMessage.trim();
  
      formData.append('message', messageBody);
      formData.append('body_text', messageBody);
      formData.append('reply_by', authState.user_id);
      formData.append('wa_receiver', selectedReceiver.phone);
      formData.append('phone', selectedReceiver.phone);
  
      await axios.post('https://wd79p.com/backend/public/api/whatsapp-send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewMessage('');
      fetchMessages(selectedReceiver);
    } catch (error) {
      console.error('Error sending message:', error);
      antdMessage.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentChange = (file) => {
    Modal.confirm({
      title: 'Confirm Attachment',
      content: `Do you want to send the file "${file.name}"?`,
      onOk: () => {
        uploadAttachment(file);
      },
      onCancel: () => {
        setAttachment(null);
      },
    });

    return false; 
  };

  const uploadAttachment = async (file) => {
    if (!selectedReceiver) {
      antdMessage.error('No receiver selected. Please select a receiver to send an attachment.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reply_by', authState.user_id);
      formData.append('wa_receiver', selectedReceiver.phone);
      formData.append('phone', selectedReceiver.phone);

      console.log('Uploading attachment payload:', formData);

      await axios.post('https://wd79p.com/backend/public/api/whatsapp-send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchMessages(selectedReceiver);
      setAttachment(null);
    } catch (error) {
      console.error('Error uploading attachment:', error);
      antdMessage.error('Failed to upload attachment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    const { firstName } = newContact;
    const existingPhone = selectedReceiver ? selectedReceiver.phone : null;
    const userId = authState.user_id;
    console.log(authState.user_id)
  
    if (!firstName || !existingPhone) {
      antdMessage.error('Please provide both name and phone number.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/contacts', {
        first_name: firstName,
        whatsapp: existingPhone,
        user_id: userId  
      });
  
      console.log('Add contact response:', response.data);
      if (response.data) {
        antdMessage.success('Contact added successfully');
       
        setNewContact({ firstName: '', phone: '' });
        setShowAddContactModal(false);
        fetchReceivers(); 
      } else {
        antdMessage.error('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      antdMessage.error('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <Modal
  title="WhatsApp Chat"
  open={visible}
  onCancel={onClose}
  footer={null}
  width={1100}
  height={1000}
  className="whatsapp-modal"
>
  <div style={{ display: 'flex' }}>
    <div className="receiver-list" style={{ flex: '0 0 200px' }}>
    <List
      itemLayout="horizontal"
      dataSource={receivers}
      renderItem={(receiver) => (
        <List.Item
        onClick={() => {
          setSelectedReceiver(receiver);
          markAsSeen(receiver.phone); 
        }}
          className={selectedReceiver === receiver ? 'ant-list-item-active' : ''}
        >
                  <List.Item.Meta
                    title={
                      <span>
                        {receiver.first_name}
                        {/* Conditionally render the button only if the contact doesn't exist */}
                        {!existingContacts.includes(receiver.phone) && (
                          <Button type="primary" onClick={() => setShowAddContactModal(true)} style={{ marginLeft: '0px' }}>+Add Contact</Button>
                        )}
                        {unseenMessages[receiver.phone] && <span style={{ color: 'red', marginTop: '20px' }}>●</span>}
                      </span>
                    }
                    description={receiver.phone}
                  />
                </List.Item>
                )}
    />
    </div>
    <div style={{ flex: 1, marginLeft: '16px' }}>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, message) => (
          <div key={msg.id} onClick={() => handleMessageClick(message.id)} className={`message ${msg.sender === senderNumber ? 'sent' : 'received'}`}>
                    <div>
                    <strong>{msg.senderName}</strong>
                  </div>
            <span>{msg.message} <span style={{ fontSize: '0.8em', color: '#888' }}>{msg.timestamp}</span></span>
            {msg.fileName && (
              msg.fileType === 'jpg' || msg.fileType === 'png' || msg.fileType === 'jpeg' ? (
                <a
                  href={`https://wd79p.com/backend/public/public/whatsappdir/${msg.fileName}`}
                  download={msg.fileName}
                >
                  <img
                    src={`https://wd79p.com/backend/public/public/whatsappdir/${msg.fileName}`}
                    alt={msg.fileName}
                    style={{ width: '100px', margin: '10px 0' }}
                  />
                </a>
              ) : (
                <a
                  href={`https://wd79p.com/backend/public/public/whatsappdir/${msg.fileName}`}
                  download={msg.fileName}
                >
                  {msg.fileName}
                </a>
              )
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex' }}>
        <Input.TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          rows={3}
        />
        <Upload beforeUpload={handleAttachmentChange} showUploadList={false}>
          <Button style={{ marginLeft: '8px' }} disabled={!selectedReceiver}>
            Attach
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleSendMessage}
          style={{ marginLeft: '8px' }}
          disabled={!selectedReceiver || loading}
        >
          Send
        </Button>
      </div>
    </div>
  </div>
</Modal>
<Modal
        title="Add New Contact"
        visible={showAddContactModal}
        onCancel={() => setShowAddContactModal(false)}
        onOk={handleAddContact}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="First Name">
            <Input
              value={newContact.firstName}
              onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Phone (WhatsApp)">
          <Input
            value={selectedReceiver ? selectedReceiver.phone : ''}
            disabled
          />
        </Form.Item>
        </Form>
      </Modal>
</>
  );
};

export default WhatsAppChatModal;
