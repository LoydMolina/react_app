import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button } from "antd";
import moment from 'moment';
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import TicketModelPopup from "../../../components/modelpopup/TicketModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TicketFilter from "../../../components/TicketFilter";
import EditTicket from "../../../components/modelpopup/EditTicket";
import MergeModal from "../Employees/MergeModal";

const Ticket = () => {
  const [users, setUsers] = useState([]);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleMergeModalOpen = () => {
    setIsMergeModalVisible(true);
  };

  const handleMergeModalClose = () => {
    setIsMergeModalVisible(false);
  };

  const handleMerge = async (ticketId, target_ticket_id) => {
    console.log('Merging tickets:', { ticketId, target_ticket_id }); 
    try {
      const response = await axios.post(`https://wd79p.com/backend/public/api/tickets/${ticketId}/merge`, {
        target_ticket_id: target_ticket_id
      });
      console.log('Merge successful:', response.data);
  
      fetchData(); 
  
      setIsMergeModalVisible(false); 
    } catch (error) {
      console.error('Error merging tickets:', error);
    }
  };
  

  useEffect(() => {
    fetch('https://wd79p.com/backend/public/api/tickets')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  const countTicketsByStatus = () => {
    const statusCounts = {};
    tickets.forEach(ticket => {
      if (ticket.status in statusCounts) {
        statusCounts[ticket.status]++;
      } else {
        statusCounts[ticket.status] = 1;
      }
    });
    return statusCounts;
  };

  const statusCounts = countTicketsByStatus();

  useEffect(() => {
    axios.get("/api/ticket.json")
      .then((res) => setUsers(res.data));
  }, []);

  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [staffs, setStaff] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCompanies();
    fetchStaff();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const primaryResponse = await axios.get('https://wd79p.com/backend/public/api/tickets');
      setData(primaryResponse.data.reverse());
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    const companyResponse = await axios.get('https://wd79p.com/backend/public/api/companies');
    setCompanies(companyResponse.data);
  };

  const fetchStaff = async () => {
    const staffResponse = await axios.get('https://wd79p.com/backend/public/api/users');
    setStaff(staffResponse.data);
  };

  const mergedData = data.map(item => {
    const company = companies.find(c => c.id === item.company_id);
    const staff = staffs.find(c => c.user_id === item.assign_staff);
    return {
      ...item,
      companyName: company ? company.name : '--',
      staffname: staff ? `${staff.first_name} ${staff.last_name}` : '--'
    };
  });

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`https://wd79p.com/backend/public/api/tickets/${ticketId}`);
      setData(data.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error("There was an error deleting the ticket!", error);
    }
  };

  const updateTicket = (updatedTicket) => {
    setData(data.map(ticket => (ticket.id === updatedTicket.id ? updatedTicket : ticket)));
  };

  const refreshTickets = () => {
    fetchData();
  };

  const handlePriorityChange = async (id, newPriority) => {
    await axios.put(`https://wd79p.com/backend/public/api/tickets/${id}`, { priority: newPriority });
    fetchData();
  };

  const handleStatusChange = async (id, newStatus) => {
    await axios.put(`https://wd79p.com/backend/public/api/tickets/${id}`, { status: newStatus });
    fetchData();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (data) => {
    return data.filter(ticket => {
      return (
        (!filters.id || ticket.id.toString().includes(filters.id)) &&
        (!filters.subject || ticket.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.companyName || ticket.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) &&
        (!filters.priority || ticket.priority === filters.priority) &&
        (!filters.status || ticket.status === filters.status) &&
        (ticket.status !== 'Closed') 
      );
    });
  };

  const handleRowClick = (record) => {
    navigate(`/ticket-details/${record.id}`, { state: { ticket: record } });
  };

  const filteredData = applyFilters(mergedData);

  const columns = [
    {
      title: "Ticket Id",
      dataIndex: "id",
      render: (text, record) => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to={{
            pathname: `/ticket-details/${record.id}`,
            state: { ticket: record }
          }}
        >
          {record.id}
        </Link>
      ),
      sorter: (a, b) => a.id - b.id, 
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to={{
            pathname: `/ticket-details/${record.id}`,
            state: { ticket: record }
          }}
        >
          {record.companyName}
        </Link>
      ),
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Ticket Subject",
      dataIndex: "subject",
      render: (text, record) => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to={{
            pathname: `/ticket-details/${record.id}`,
            state: { ticket: record }
          }}
        >
          {record.subject}
        </Link>
      ),
      sorter: (a, b) => a.subject.length - b.subject.length,
    },
    {
      title: "Assigned Staff",
      dataIndex: "staffname",
      key: "staffname",
      sorter: (a, b) => a.staffname.localeCompare(b.staffname),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
    {
      title: "Last Reply",
      dataIndex: "updated_at",
      sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority, record) => (
        <div className="dropdown action-label" onClick={(e) => e.stopPropagation()}>
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className={`far fa-dot-circle ${priority === 'Emergency' ? 'far fa-dot-circle text-danger' 
              : priority === 'High' ? 'far fa-circle text-danger' 
              : priority === 'Medium' ? 'far fa-circle text-warning' 
              : 'far fa-circle text-success'}`} /> {priority}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#" onClick={() => handlePriorityChange(record.id, 'Emergency')}>
              <i className="far fa-dot-circle text-danger" /> Emergency
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handlePriorityChange(record.id, 'High')}>
              <i className="far fa-circle text-danger" /> High
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handlePriorityChange(record.id, 'Medium')}>
              <i className="far fa-circle text-warning" /> Medium
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handlePriorityChange(record.id, 'Low')}>
              <i className="far fa-circle text-success" /> Low
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <div className="dropdown action-label text-center" onClick={(e) => e.stopPropagation()}>
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className={`far fa-dot-circle ${
                status === 'New' ? 'far fa-circle text-success' 
              : status === 'Open' ? 'far fa-dot-circle text-success' 
              : status === 'Reopened' ? 'far fa-dot-circle text-info' 
              : status === 'On Hold' ? 'far fa-dot-circle text-warning' 
              : status === 'Closed' ? 'far fa-dot-circle text-danger' 
              : status === 'In Progress' ? 'far fa-circle text-info' 
              : status === 'Cancelled' ? 'far fa-circle text-dangertext-danger' 
              : ''
            }`} /> {status}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#" onClick={() => handleStatusChange(record.id, 'New')}>
              <i className="far fa-circle text-success" /> New
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handleStatusChange(record.id, 'Open')}>
              <i className="far fa-dot-circle text-success" /> Open
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handleStatusChange(record.id, 'On Hold')}>
              <i className="far fa-dot-circle text-warning" /> On Hold
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handleStatusChange(record.id, 'Closed')}>
              <i className="far fa-dot-circle text-danger" /> Closed
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => handleStatusChange(record.id, 'Cancelled')}>
              <i className="far fa-circle text-dangertext-danger" /> Cancelled
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
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
              data-bs-target="#edit_ticket"
              onClick={() => {
                setTicketToEdit(record);
                setIsEditModalVisible(true);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setTicketToDelete(record)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: true,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Tickets"
            title="Dashboard"
            subtitle="Tickets"
            modal="#add_ticket"
            name="Add Ticket"
          />
          <div className="row">
      <div className="col-md-12">
        <div className="card-group m-b-30">
          {Object.keys(statusCounts).map((status, index) => (
            <div className="card" key={index}>
              <div className="card-body">
                <h4 className="card-title">{status}</h4>
                <p className="card-text">Count: {statusCounts[status]}</p>
              </div>
            </div>
          ))}
        </div>
        <MergeModal
        visible={isMergeModalVisible}
        onCancel={handleMergeModalClose}
        onMerge={handleMerge}
        tickets={tickets}
      />
      <Button onClick={handleMergeModalOpen}>Merge Tickets</Button>
      </div>
    </div>
          <TicketFilter onFilterChange={handleFilterChange} />
          
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={filteredData}
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

      <TicketModelPopup onSave={refreshTickets}/>
      <DeleteModal
        Name={ticketToDelete ? `Ticket #${ticketToDelete.id}` : 'Delete Ticket'}
        deleteAction={() => {
          if (ticketToDelete) {
            deleteTicket(ticketToDelete.id);
            setTicketToDelete(null);
          }
        }}
      />
      <EditTicket
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={updateTicket}
        ticket={ticketToEdit}
        staffs={staffs}
        companies={companies}
      />
    </>
  );
};

export default Ticket;
