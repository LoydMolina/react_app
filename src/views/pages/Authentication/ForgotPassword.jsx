import React, { useState } from "react";
import axios from "axios";
import { Applogo } from "../../../Routes/ImagePath";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending email:", email); // Log the email
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error('Error in handleSubmit:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <Link to="/app/main/dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Forgot Password?</h3>
                <p className="account-subtitle">Enter your email to get a password reset link</p>
                <form onSubmit={handleSubmit}>
                  <div className="input-block">
                    <label>Email Address</label>
                    <input
                      className="form-control"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-block text-center">
                    <button className="btn btn-primary account-btn" type="submit">Reset Password</button>
                  </div>
                  <div className="account-footer">
                    <p>Remember your password? <Link to="/">Login</Link></p>
                  </div>
                </form>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
