import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompaniesModal from '../../../components/modelpopup/CompaniesModal';
import AddNotes from '../../../components/modelpopup/Crm/AddNotes';
import CompaniesGrid from './CompaniesGrid';
import CompaniesHeader from './CompaniesHeader';
import FilterFields from './FilterFields';
import CompaniesTable from './CompaniesTable';
import CompanyDetails from './CompanyDetails';
import { getCompanies, deleteCompany, getCompany } from '../../../apiService';
import { useAuth } from "../../../AuthContext";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [fieldInputs, setFieldInputs] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [inputValueTwo, setInputValueTwo] = useState("");
  const [inputValueThree, setInputValueThree] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewType, setViewType] = useState('table');
  const { authState } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies(authState.token); 
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    if (authState?.token) {
      fetchCompanies(); 
    }
  }, [authState?.token]);

  const handleSearch = () => {
    const filtered = companies.filter(company => {
      return (
        (inputValue ? company.name.toLowerCase().includes(inputValue.toLowerCase()) : true) &&
        (inputValueTwo ? company.email.toLowerCase().includes(inputValueTwo.toLowerCase()) : true) &&
        (inputValueThree ? company.phone_number.toLowerCase().includes(inputValueThree.toLowerCase()) : true)
      );
    });
    setFilteredCompanies(filtered);
  };

  const handleEdit = async (company) => {
    const companyWithAddresses = await getCompany(company.id, authState.token);
    if(companyWithAddresses && authState?.token) {
    setSelectedCompany(company); 
    setIsModalOpen(true);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCompany) {
      try {
        await deleteCompany(selectedCompany.id, authState.token); 
        const updatedCompanies = companies.filter(company => company.id !== selectedCompany.id);
        setCompanies(updatedCompanies);
        setFilteredCompanies(updatedCompanies);
        setIsDeleteModalOpen(false);
        setSelectedCompany(null);
      } catch (error) {
        console.error('Failed to delete company:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = authState.token
      const data = await getCompanies(token);
      setCompanies(data);
      setFilteredCompanies(data);
      setIsModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Failed to save company:", error);
    } finally {
    }
  };
  const handleSelectCompany = async (company) => {
    try {
      const companyWithDetails = await getCompany(company.id, authState.token);
  
      if (companyWithDetails && authState?.token) {
        setSelectedCompany(companyWithDetails);  
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex">
          <div>
            <h2 className="table-avatar d-flex align-items-center table-padding">
              {/* <Link to="#" className="company-img" onClick={() => handleSelectCompany(record)}>
                <img src={record.profile_image || 'default-image-path'} alt="UserImage" />
              </Link> */}
              <Link className="profile-split" onClick={() => handleSelectCompany(record)}>
                {record.name}
              </Link>
            </h2>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Vendor Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Mobile Number",
      dataIndex: "phone_number",
      sorter: (a, b) => a.phone_number.length - b.phone_number.length,
    },
    {
      title: "Telephone Number",
      dataIndex: "telephone_number",
      sorter: (a, b) => a.telephone_number.length - b.telephone_number.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown action-label">
          <Link to="#" className={text === "Inactive" ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
            "btn btn-white btn-sm badge-outline-success status-color"}> {text} </Link>
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
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
              data-bs-target="#add_company"
              onClick={() => handleEdit(record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => {
                setSelectedCompany(record);
                setIsDeleteModalOpen(true);
              }}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  if (selectedCompany && !isDeleteModalOpen && !isModalOpen) {
    return <CompanyDetails company={selectedCompany} onBack={() => setSelectedCompany(null)} />;
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <CompaniesHeader 
          setViewType={setViewType}
          fieldInputs={fieldInputs}
          setFieldInputs={setFieldInputs}
          handleAddCompany={handleAddCompany}
        />
        <FilterFields 
          fieldInputs={fieldInputs}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputValueTwo={inputValueTwo}
          setInputValueTwo={setInputValueTwo}
          inputValueThree={inputValueThree}
          setInputValueThree={setInputValueThree}
          handleSearch={handleSearch}
        />
        <hr />
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              {viewType === 'table' ? (
                <CompaniesTable columns={columns} data={filteredCompanies} />
              ) : (
                <CompaniesGrid companies={filteredCompanies} />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CompaniesModal
          company={selectedCompany}
          onSave={handleSave}
        />
      )}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                {/* <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  <span>&times;</span>
                </button> */}
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {selectedCompany?.name}?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AddNotes />
    </div>
  );
};

export default Companies;
