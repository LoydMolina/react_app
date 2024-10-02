import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Card } from 'antd';

const { Option } = Select;

const MergeModal = ({ visible, onCancel, onMerge, tickets, initialTicketId }) => {
  const [selectedTicket1, setSelectedTicket1] = useState(null);
  const [selectedTicket2, setSelectedTicket2] = useState(null);
  const [suggestedTickets, setSuggestedTickets] = useState([]);

  useEffect(() => {
    if (initialTicketId) {
      setSelectedTicket1(initialTicketId);
      setSuggestedTickets(findSuggestedTickets(initialTicketId));
    }
  }, [initialTicketId]);

  const findSuggestedTickets = (ticketId) => {
    const initialTicket = tickets.find(ticket => ticket.id === ticketId);
    if (initialTicket) {
      const suggested = tickets.filter(ticket => ticket.user_id === initialTicket.user_id && ticket.id !== initialTicket.id && ticket.status !== "Closed");
      return suggested.slice(0, 3); 
    }
    return [];
  };

  const handleMerge = () => {
    if (selectedTicket1 && selectedTicket2 && selectedTicket1 !== selectedTicket2) {
      onMerge(selectedTicket1, selectedTicket2);
      setSelectedTicket1(null);
      setSelectedTicket2(null);
    }
  };

  const filteredTickets = tickets.filter(ticket => ticket.status !== "Closed");

  return (
    <Modal
      title="Merge Tickets"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          style={{ backgroundColor: '#FF902F', borderColor: '#FF902F', marginTop: '10px' }}
          key="merge"
          type="primary"
          onClick={handleMerge}
        >
          Merge
        </Button>,
      ]}
    >
      <p>Select tickets to merge:</p>
      <Select
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Select first ticket"
        value={selectedTicket1}
        onChange={value => {
          setSelectedTicket1(value);
          setSuggestedTickets(findSuggestedTickets(value)); 
        }}
      >
        {filteredTickets.map(ticket => (
          <Option key={ticket.id} value={ticket.id}>
            {ticket.subject} - {ticket.id}
          </Option>
        ))}
      </Select>
      <Select
        showSearch
        style={{ width: '100%', marginTop: '10px' }}
        placeholder="Select or search second ticket"
        value={selectedTicket2}
        onChange={value => setSelectedTicket2(value)}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {filteredTickets.map(ticket => (
          <Option key={ticket.id} value={ticket.id}>
            {ticket.subject} - {ticket.id}
          </Option>
        ))}
      </Select>
      
      {suggestedTickets.length > 0 && (
        <div>
          <p className='suggested-ticket' style={{backgroundColor:'#FC6272', marginTop:'15px'}}>Suggested tickets to merge with {selectedTicket1}:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {suggestedTickets.map(ticket => (
              <Card key={ticket.id} style={{ width: 200, margin: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{ticket.subject}</p>
                <p style={{ fontSize: '12px', marginBottom: '8px' }}>Ticket ID: {ticket.id}</p>
                <Button size="small" onClick={() => setSelectedTicket2(ticket.id)}>Select</Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MergeModal;
