import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Select from "react-select";
import { Applogo } from "../../../Routes/ImagePath";
import { emailrgx } from "../Authentication/RegEx";

const schema = yup.object().shape({
  username: yup.string().required("Username is required").trim(),
  email: yup.string().matches(emailrgx, "Invalid email address").required("Email is required").trim(),
  password: yup.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters").required("Password is required").trim(),
  repeatPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Repeat password is required").trim(),
  firstName: yup.string().required("First Name is required").trim(),
  lastName: yup.string().required("Last Name is required").trim(),
  displayName: yup.string().required("Display Name is required").trim(),
  phone: yup.string().required("Phone is required").trim(),
  role: yup.object().shape({
    value: yup.string().required("Role is required"),
    label: yup.string().required("Role is required"),
  }),
  company: yup.object().shape({
    value: yup.string().required("Company is required"),
    label: yup.string().required("Company is required"),
  }),
  employeeId: yup.string().required("Employee ID is required").trim(),
});

const Register = (props) => {
  const [passwordEye, setPasswordEye] = useState(true);
  const [repeatPasswordEye, setRepeatPasswordEye] = useState(true);
  const [checkUser, setCheckUser] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(null);
  const [company, setCompany] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [companies, setCompanies] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        phone,
        role: role ? role.value : "N/A",
        company_id: company ? company.value : "N/A",
        employee_id: employeeId,
      };

      const response = await axios.post("https://wd79p.com/backend/public/api/users", userData);

      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setRegistrationError(error.response.data.message);
      } else {
        setRegistrationError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            {/* Account Logo */}
            <div className="account-logo">
              <Link to="/admin-dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>
            {/* /Account Logo */}
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Register</h3>
                <p className="account-subtitle">Access to our dashboard</p>
                {/* Account Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-block mb-3">
                    <label className="col-form-label">First Name</label>
                    <input
                      className={`form-control ${errors?.firstName ? "error-input" : ""}`}
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="text-danger">{errors?.firstName?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Last Name</label>
                    <input
                      className={`form-control ${errors?.lastName ? "error-input" : ""}`}
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="text-danger">{errors?.lastName?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Display Name</label>
                    <input
                      className={`form-control ${errors?.displayName ? "error-input" : ""}`}
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="text-danger">{errors?.displayName?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control ${errors?.email ? "error-input" : ""}`}
                          type="text"
                          value={value}
                          onChange={onChange}
                          autoComplete="off"
                        />
                      )}
                    />
                    <span className="text-danger">{errors?.email?.message}</span>
                    <span className="text-danger">{checkUser ? "This email already exists" : ""}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Phone</label>
                    <input
                      className={`form-control ${errors?.phone ? "error-input" : ""}`}
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="text-danger">{errors?.phone?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Role</label>
                    <Select
                      value={role}
                      onChange={setRole}
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Employee", label: "Employee" },
                      ]}
                    />
                    <span className="text-danger">{errors?.role?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Company</label>
                    <Select
                      value={company}
                      onChange={setCompany}
                      options={companies.map(company => ({ value: company.id, label: company.name }))}
                    />
                    <span className="text-danger">{errors?.company?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Employee ID</label>
                    <input
                      className={`form-control ${errors?.employeeId ? "error-input" : ""}`}
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="text-danger">{errors?.employeeId?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Password</label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            type={passwordEye ? "password" : "text"}
                            className={`form-control ${errors?.password ? "error-input" : ""}`}
                            value={value}
                            onChange={onChange}
                            autoComplete="off"
                          />
                          <span
                            style={{ position: "absolute", right: "5%", top: "30%" }}
                            onClick={() => setPasswordEye(!passwordEye)}
                            className={`fa toggle-password ${passwordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                      defaultValue=""
                    />
                    <span className="text-danger">{errors?.password?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Repeat Password</label>
                    <Controller
                      name="repeatPassword"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            type={repeatPasswordEye ? "password" : "text"}
                            className={`form-control ${errors?.repeatPassword ? "error-input" : ""}`}
                            value={value}
                            onChange={onChange}
                            autoComplete="off"
                          />
                          <span
                            style={{ position: "absolute", right: "5%", top: "30%" }}
                            onClick={() => setRepeatPasswordEye(!repeatPasswordEye)}
                            className={`fa toggle-password ${repeatPasswordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                      defaultValue=""
                    />
                    <span className="text-danger">{errors?.repeatPassword?.message}</span>
                  </div>
                  {registrationError && (
                    <div className="text-danger mb-3">{registrationError}</div>
                  )}
                  <div className="input-block text-center">
                    <button type="submit" className="btn btn-primary account-btn">
                      Register
                    </button>
                  </div>
                </form>

                <div className="account-footer">
                  <p>
                    Already have an account? <Link to="/">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
