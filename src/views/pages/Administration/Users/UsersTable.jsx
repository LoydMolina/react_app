import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import EditUseModal from "../../../../components/Administration/Users/EditUseModal";
import DeleteModal from "../../../../components/modelpopup/deletePopup";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null); // State to manage edited user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [primaryResponse, companyResponse] = await Promise.all([
          axios.get('https://wd79p.com/backend/public/api/users'),
          axios.get('https://wd79p.com/backend/public/api/companies')
        ]);
        setData(primaryResponse.data);
        setCompanies(companyResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
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

  const handleRowClick = (record) => {
    navigate(`/users-details/${record.id}`, { state: { user: record } });
  };

  const handleEditUser = (record) => {
    setEditUser(record); // Set the user to edit
  };

  const handleSaveUser = (updatedUser) => {
    const updatedData = data.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setData(updatedData);
    setEditUser(null); // Close the edit modal after save
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
      sorter: (a, b) => a.id - b.id,
    }, 
    {
      title: "Employee Id",
      dataIndex: "employee_id",
      sorter: (a, b) => a.employee_id.localeCompare(b.employee_id),
    },
    {
      title: "Full Name",
      render: (text, record) => (
        <span>{record.first_name} {record.last_name}</span>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
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
      sorter: (a, b) => a.role.localeCompare(b.role),
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
              onClick={() => handleEditUser(record)} // Open EditUserModal
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

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
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
              className: 'table-row-hover'
            })}
          />
          {editUser && (
            <EditUseModal
              visible={!!editUser}
              onClose={() => setEditUser(null)}
              onSave={handleSaveUser}
              user={editUser}
              companies={companies}
            />
          )}
          {userToDelete && (
            <DeleteModal
              Name={`User #${userToDelete.id}`}
              deleteAction={() => {
                if (userToDelete) {
                  deleteUser(userToDelete.id);
                  setUserToDelete(null);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
