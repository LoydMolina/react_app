import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Input } from "antd";
import EditUseModal from "../../../../components/Administration/Users/EditUseModal";
import DeleteModal from "../../../../components/modelpopup/deletePopup";
import {useAuth} from '../../../../AuthContext'

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [filterText, setFilterText] = useState(""); 
  const navigate = useNavigate();
  const {authState} = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = authState.token;
    try {
      const [primaryResponse, companyResponse] = await Promise.all([
        axios.get('https://wd79p.com/backend/public/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }),
        axios.get('https://wd79p.com/backend/public/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
      ]);
      setData(primaryResponse.data);
      setCompanies(companyResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const displayValue = (value) => {
    return value ? value : "--";
  };

  const mergedData = data.map(item => {
    const company = companies.find(c => c.id === item.company_id);
    return {
      ...item,
      companyName: displayValue(company ? company.name : "--"),
      first_name: displayValue(item.first_name),
      last_name: displayValue(item.last_name),
      employee_id: displayValue(item.employee_id),
      phone: displayValue(item.phone),
      role: displayValue(item.role),
      created_at: displayValue(item.created_at)
    };
  });

  const filteredData = mergedData.filter(item => 
    (item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.last_name && item.last_name.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.employee_id && item.employee_id.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.role && item.role.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.companyName && item.companyName.toLowerCase().includes(filterText.toLowerCase()))
  );

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://wd79p.com/backend/public/api/users/${userId}`);
      setData(data.filter(user => user.user_id !== userId)); 
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  const handleRowClick = (record) => {
    navigate(`/users-details/${record.user_id}`, { state: { user: record } }); 
  };

  const handleEditUser = (record) => {
    setEditUser(record); 
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      await fetchData();
      setEditUser(null); 
    } catch (error) {
      console.error("There was an error saving the user!", error);
    }
  };
  
  const columns = [
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
              onClick={() => handleEditUser(record)}
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
          <Input
            placeholder="Search users"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Table
            className="table-striped"
            rowKey={(record) => record.user_id} 
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={filteredData}
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
              Name={`User#${userToDelete.user_id}`} 
              deleteAction={() => {
                if (userToDelete) {
                  deleteUser(userToDelete.user_id); 
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
