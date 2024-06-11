import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import EditUserModal from "../../../../components/Administration/Users/EditUseModal";
import DeleteModal from "../../../../components/modelpopup/deletePopup";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const primaryResponse = await axios.get('https://wd79p.com/backend/public/api/users');
      setData(primaryResponse.data);
    };

    const fetchCompanies = async () => {
      const companyResponse = await axios.get('https://wd79p.com/backend/public/api/companies');
      setCompanies(companyResponse.data);
    };

    fetchData();
    fetchCompanies();
  }, []);

  const mergedData = data.map(item => {
    const company = companies.find(c => c.id === item.company_id);
    return {
      ...item,
      companyName: company ? company.name : '--',
    };
    
  });

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://wd79p.com/backend/public/api/users/${userId}`);
      setData(data.filter(user => user.id !== userId));
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  const columns = [
    { 
      title: "Id",
      dataIndex: "id",
      render: (text, record) => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to={{
            pathname: `/users-details/${record.id}`,
            state: { user: record }
          }}
        >
          {record.id}
        </Link>
      ),
     sorter: (a, b) => a.id.length - b.id.length,
    }, 
    {
      title: "Employee Id",
      dataIndex: "employee_id",
      sorter: (a, b) => a.employee_id.length - b.employee_id.length,
    },
    {
      title: "Full Name",
      render: (text, record) => (
        <span>{record.first_name} {record.last_name}</span>
      ),
      sorter: (a, b) => a.first_name.length - b.first_name.length,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.length - b.companyName.length,
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      sorter: (a, b) => a.created_date.length - b.created_date.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text) => (
        <span
          className={
            text === "Admin"
              ? "badge bg-inverse-danger"
              : "badge bg-inverse-success"
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-end">
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
              data-bs-target="#edit_user"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setUserToDelete(record)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: false,
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={mergedData}
          />
          <EditUserModal />
          <DeleteModal
            Name={userToDelete ? `User #${userToDelete.id}` : 'Delete User'}
            deleteAction={() => {
              if (userToDelete) {
                deleteUser(userToDelete.id);
                setUserToDelete(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
