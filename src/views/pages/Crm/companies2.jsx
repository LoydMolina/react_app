import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompaniesModal from '../../../components/modelpopup/CompaniesModal';
import AddNotes from '../../../components/modelpopup/Crm/AddNotes';
import CompaniesGrid from './CompaniesGrid';
import CompaniesHeader from './CompaniesHeader';
import FilterFields from './FilterFields';
import CompaniesTable from './CompaniesTable';
import CompanyDetails from './CompanyDetails';
import { getCompanies, deleteCompany } from '../../../apiService';

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
  const [isViewingDetails, setIsViewingDetails] = useState(false); // State for viewing company details
  const [viewType, setViewType] = useState('table');

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    };

    fetchCompanies();
  }, []);

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

  const handleEdit = (company) => {
    setSelectedCompany(company); // Set the selected company for editing
    setIsModalOpen(true); // Open the modal for editing
    setIsViewingDetails(false); // Ensure details view is not active
  };

  const handleAddCompany = () => {
    setSelectedCompany(null); // For adding, no company is selected
    setIsModalOpen(true); // Open the modal for adding
  };

  const handleDelete = async () => {
    if (selectedCompany) {
      try {
        await deleteCompany(selectedCompany.id);
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
    const data = await getCompanies(); // Fetch the updated list of companies
    setCompanies(data); // Update the state with new companies list
    setFilteredCompanies(data);
    setIsModalOpen(false); // Close the modal after save
    setSelectedCompany(null); // Reset selected company
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setIsViewingDetails(true); // Trigger showing the details view
    setIsModalOpen(false); // Ensure modal is not open
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex">
          <div>
            <h2 className="table-avatar d-flex align-items-center table-padding">
              {/* Ensure the onClick triggers the company details view */}
              <Link to="#" className="company-img" onClick={() => handleSelectCompany(record)}>
                <img src={record.profile_image || 'default-image-path'} alt="UserImage" />
              </Link>
              <Link to="#" className="profile-split" onClick={() => handleSelectCompany(record)}>
                {record.name}
              </Link>
            </h2>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Company Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
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
              onClick={() => handleEdit(record)} // Trigger edit modal
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
      
      {/* Modal for Adding/Editing */}
      {isModalOpen && (
        <CompaniesModal
          company={selectedCompany} // Pass selected company for editing
          onSave={handleSave} // Trigger save after editing
          onClose={() => setIsModalOpen(false)} // Close modal
        />
      )}

      {/* Company Details View */}
      {isViewingDetails && selectedCompany && (
        <CompanyDetails company={selectedCompany} onBack={() => setIsViewingDetails(false)} />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
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
    </div>
  );
};

export default Companies;
