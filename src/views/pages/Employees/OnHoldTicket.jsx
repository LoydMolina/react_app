// OnHoldTicket.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import moment from 'moment';
import TicketFilter from "../../../components/TicketFilter";

const OnHoldTicket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (record) => {
    navigate(`/ticket-details/${record.id}`, { state: { ticket: record } });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/tickets');
      const onHoldTickets = response.data.filter(ticket => ticket.status === 'To Be Followed Up');
      setData(onHoldTickets);
    } catch (error) {
      console.error('Error fetching on-hold tickets:', error);
    } finally {
      setLoading(false);
    }
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
        (!filters.priority || ticket.priority === filters.priority)
      );
    });
  };

  const filteredData = applyFilters(data);

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
      title: "Last Reply",
      dataIndex: "updated_at",
      sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
    // {
    //   title: "Priority",
    //   dataIndex: "priority",
    //   render: (priority) => {
    //     let icon;
    //     let textColor;
    
    //     switch (priority) {
    //       case "Emergency":
    //         icon = <i className="far fa-dot-circle text-danger" />;
    //         break;
    //       case "High":
    //         icon = <i className="far fa-circle text-danger" />;
    //         break;
    //       case "Medium":
    //         icon = <i className="far fa-circle text-warning" />;
    //         break;
    //       case "Low":
    //         icon = <i className="far fa-circle text-success" />;
    //         break;
    //       default:
    //         icon = <i className="far fa-circle" />;
    //         textColor = "text-muted";
    //     }
    
    //     return (
    //       <div className="d-flex align-items-center">
    //         {icon}
    //         <span className={`ml-2 ${textColor || ''}`}>{priority}</span>
    //       </div>
    //     );
    //   },
    //   sorter: (a, b) => {
    //     const priorityOrder = { Emergency: 1, High: 2, Medium: 3, Low: 4 };
    //     return priorityOrder[a.priority] - priorityOrder[b.priority];
    //   },
    // },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div>
            <h2>On Hold Tickets</h2>
            <h5>Dashboard  /  On Hold Tickets</h5>
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
    </>
  );
};

export default OnHoldTicket;
