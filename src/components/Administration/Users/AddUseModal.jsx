import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import axios from "axios";

const AddUserModal = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(null);
  const [company, setCompany] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const generateEmployeeId = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Random number between 1000 and 9999
    return `SPRK${randomNumber}`;
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  const roleOptions = [
    { value: "", label: "--Select Role--" },
    { value: "Admin", label: "Admin" },
    { value: "Employee", label: "Employee" },
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("https://wd79p.com/backend/public/api/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last Name is required";
    }
    if (!displayName.trim()) {
      errors.displayName = "Display Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(password)) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!phone.trim()) {
      errors.phone = "Phone is required";
    }
    if (!role) {
      errors.role = "Role is required";
    }
    if (!company) {
      errors.company = "Company is required";
    }
    // if (!employeeId.trim()) {
    //   errors.employeeId = "Employee ID is required";
    // }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitting(false);
      return;
    }

    setFormErrors({});

    const userData = {
      first_name: firstName,
      last_name: lastName,
      username: displayName,
      email,
      password,
      password_confirmation: confirmPassword,
      phone,
      role: role ? role.value : "N/A",
      company_id: company ? company.value : "N/A",
      employee_id: employeeId,
    };

    try {
      const response = await axios.post("https://wd79p.com/backend/public/api/users", userData);
      console.log("User added successfully:", response.data);
      setFirstName("");
      setLastName("");
      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setRole(null);
      setCompany(null);
      setEmployeeId(generateEmployeeId());
      document.getElementById("closeAddUserModalButton").click();
    } catch (error) {
      console.error("There was an error adding the user:", error);
      if (error.response && error.response.data) {
        console.error("Response data:", error.response.data);
        setFormErrors(error.response.data.errors || {});
      } else {
        alert("There was an error adding the user. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  }, [firstName, lastName, displayName, email, password, confirmPassword, phone, role, company, employeeId]);

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const formField = (label, type, value, setter, error) => (
    <div className="col-sm-6">
      <div className="input-block mb-3">
        <label className="col-form-label">
          {label} {type !== "select" && <span className="text-danger">*</span>}
        </label>
        {type === "select" ? (
          <Select
            placeholder={`--Select ${label}--`}
            value={value}
            onChange={setter}
            options={type === "select" && label === "Role" ? roleOptions : [{ value: "", label: "--Select Company--" }, ...companies.map(company => ({ value: company.id, label: company.name }))]}
            className={`select floating ${error ? "is-invalid" : ""}`}
            styles={customStyles}
          />
        ) : (
          <input
            className={`form-control ${error ? "is-invalid" : ""}`}
            type={type}
            value={value}
            onChange={handleInputChange(setter)}
          />
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );

  return (
    <div id="add_user" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add User</h5>
            <button id="closeAddUserModalButton" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {formField("First Name", "text", firstName, setFirstName, formErrors.firstName)}
                {formField("Last Name", "text", lastName, setLastName, formErrors.lastName)}
                {formField("Display Name", "text", displayName, setDisplayName, formErrors.displayName)}
                {formField("Email", "email", email, setEmail, formErrors.email)}
                {formField("Password", "password", password, setPassword, formErrors.password)}
                {formField("Confirm Password", "password", confirmPassword, setConfirmPassword, formErrors.confirmPassword)}
                {formField("Phone", "text", phone, setPhone, formErrors.phone)}
                {formField("Role", "select", role, setRole, formErrors.role)}
                {formField("Company", "select", company, setCompany, formErrors.company)}
                {("Employee ID", "text", employeeId, setEmployeeId, formErrors.employeeId)}
              </div>
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
