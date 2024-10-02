import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import moment from 'moment';
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import TicketModelPopup from "../../../components/modelpopup/TicketModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TicketFilter from "../../../components/TicketFilter";
import EditTicket from "../../../components/modelpopup/EditTicket";
import MergeModal from "../Employees/MergeModal";
import { useAuth } from "../../../AuthContext";
import './Ticket.css' 

const Ticket = () => {
  // const [users, setUsers] = useState([]);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [selectedTicketForMerge, setSelectedTicketForMerge] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleMergeModalOpen = (record) => {
    setSelectedTicketForMerge(record.id); 
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

  // useEffect(() => {
  //   axios.get("/api/ticket.json")
  //     .then((res) => setUsers(res.data));
  // }, []);

  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [staffs, setStaff] = useState([]);

  useEffect(() => {
    fetchData();
    if (authState?.token) {
      fetchCompanies(); 
      fetchStaff();
    }
  }, [authState?.token]);

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
    try{
      const companyResponse = await axios.get('https://wd79p.com/backend/public/api/companies',{
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
    setCompanies(companyResponse.data);
    } catch (error) {
    console.error("Error fetching contacts:", error);
    };
  };

  const fetchStaff = async () => {
    const staffResponse = await axios.get('https://wd79p.com/backend/public/api/users',{
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
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

  const refreshTickets = async () => {
    fetchData();
  };
  const handleDropdownToggle = (recordId) => {
    setOpenDropdown(openDropdown === recordId ? null : recordId);
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
        (ticket.status !== 'Closed') &&
        (ticket.status !== 'To Be Followed Up')
      );
    });
  };

  const handleRowClick = (record, e) => {
    const targetElement = e.target.closest('.action-label, .dropdown-action');
    if (targetElement) {
      return;
    }
    navigate(`/ticket-details/${record.id}`, { state: { ticket: record } });
  };
  

  const filteredData = applyFilters(mergedData);
  const priorityOrder = {
    'Emergency': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4
  };

  const sortedFilteredData = filteredData.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const columns = [
    {
      title: "Ticket Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id, 
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Ticket Subject",
      dataIndex: "subject",
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
      title: "To Email",
      dataIndex: "to_email",
      sorter: (a, b) => a.to_email.length - b.to_email.length,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority, record) => (
        <div className="dropdown action-label" >
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            onClick={() => handleDropdownToggle(record.id)}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor:
                priority === 'Low' ? 'lightgreen'
                : priority === 'High' ? 'lightblue'
                : priority === 'Medium' ? 'lightyellow'
                : priority === 'Emergency' ? 'red'
                : '',
              color: 'black', 
            }}
          >
            
            <i className={` ${
                priority === 'Emergency' ? 'status-closed' 
              : priority === 'High' ? 'status-open' 
              : priority === 'Medium' ? 'status-on-hold' 
              : 'status-new'}`} /> {priority}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" style={{backgroundColor:'red'}} to="#" onClick={() => handlePriorityChange(record.id, 'Emergency')}>
               Emergency
            </Link>
            <Link className="dropdown-item " style={{backgroundColor:'lightblue'}} to="#" onClick={() => handlePriorityChange(record.id, 'High')}>
               High
            </Link>
            <Link className="dropdown-item"style={{backgroundColor:'lightyellow'}} to="#" onClick={() => handlePriorityChange(record.id, 'Medium')}>
               Medium
            </Link>
            <Link className="dropdown-item"style={{backgroundColor:'lightgreen'}} to="#" onClick={() => handlePriorityChange(record.id, 'Low')}>
               Low
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
        <div className="dropdown action-label text-center" >
          <Link
            className="btn btn-sm btn-rounded dropdown-toggle"
            onClick={() => handleDropdownToggle(record.id)}
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor:
                status === 'New' ? 'lightgreen'
                : status === 'In Progress' ? 'lightblue'
                : status === 'To Be Followed' ? 'lightyellow'
                : status === 'Estimate Sent' ? 'cyan'
                : status === 'Purchased Order' ? 'orange'
                : status === 'Solved' ? 'white'
                : status === 'Closed' ? 'red'
                : '',
              color: 'black', 
            }}
          >
            <i
              className={` ${
                status === 'New' ? 'status-new' 
                : status === 'In Progress' ? 'status-open' 
                : status === 'To be Followed Up' ? 'status-on-hold' 
                : status === 'Estimate Sent' ? 'status-closed' 
                : status === 'Purchased Order' ? 'status-cancelled' 
                : status === 'Solved' ? 'status-cancelled' 
                : status === 'Closed' ? 'status-cancelled' 
                : ''
              }`}
            />{' '}
            {status}
          </Link>


          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" style={{backgroundColor:'lightgreen'}} to="#" onClick={() => handleStatusChange(record.id, 'New')}>
               New
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'lightblue'}} to="#" onClick={() => handleStatusChange(record.id, 'In Progress')}>
               In Progress
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'lightyellow'}} to="#" onClick={() => handleStatusChange(record.id, 'To Be Followed Up')}>
               To Be Followed Up
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'cyan'}} to="#" onClick={() => handleStatusChange(record.id, 'Estimate Sent')}>
               Estimate Sent
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'orange'}} to="#" onClick={() => handleStatusChange(record.id, 'Purchased Order')}>
               Purchased Order
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'white'}} to="#" onClick={() => handleStatusChange(record.id, 'Solved')}>
               Solved
            </Link>
            <Link className="dropdown-item" style={{backgroundColor:'red'}} to="#" onClick={() => handleStatusChange(record.id, 'Closed')}>
               Closed
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-end" >
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
              data-bs-target="#merge"
              onClick={() => handleMergeModalOpen(record)} 
            >
              <i className="fa fa-code-branch m-r-5" /> Merge
            </Link>
            {/* <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setTicketToDelete(record)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link> */}
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
        initialTicketId={selectedTicketForMerge}
      />
      </div>
    </div>
          <TicketFilter onFilterChange={handleFilterChange} />
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto", paddingBottom:'200px' }}
                  columns={columns}
                  dataSource={sortedFilteredData}
                  loading={loading}
                  onRow={(record) => ({
                    onClick: (e) => handleRowClick(record,e),
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
