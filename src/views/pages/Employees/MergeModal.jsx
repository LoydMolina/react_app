// MergeModal.js
import React, { useState } from 'react';
import { Modal, Select, Button } from 'antd';

const { Option } = Select;

const MergeModal = ({ visible, onCancel, onMerge, tickets }) => {
  const [selectedTicket1, setSelectedTicket1] = useState(null);
  const [selectedTicket2, setSelectedTicket2] = useState(null);

  const handleMerge = () => {
    if (selectedTicket1 && selectedTicket2 && selectedTicket1 !== selectedTicket2) {
      onMerge(selectedTicket1, selectedTicket2);
      setSelectedTicket1(null);
      setSelectedTicket2(null);
    }
  };

  return (
    <Modal
      title="Merge Tickets"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="merge" type="primary" onClick={handleMerge}>
          Merge
        </Button>,
      ]}
    >
      <p>Select two tickets to merge:</p>
      <Select
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Select first ticket"
        onChange={value => setSelectedTicket1(value)}
      >
        {tickets.map(ticket => (
          <Option key={ticket.id} value={ticket.id}>
            {ticket.subject} - {ticket.id}
          </Option>
        ))}
      </Select>
      <Select
        style={{ width: '100%' }}
        placeholder="Select second ticket"
        onChange={value => setSelectedTicket2(value)}
      >
        {tickets.map(ticket => (
          <Option key={ticket.id} value={ticket.id}>
            {ticket.subject} - {ticket.id}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default MergeModal;
