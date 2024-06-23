/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath"; // Adjust the path as needed
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { login } from "../../../user"; // Adjust the path to where your login function is defined
import { resetFunctionwithlogin } from "../../../components/ResetFunction"; // Adjust the path as needed
import axios from "axios";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: localStorage.getItem("email") || "",
      password: localStorage.getItem("password") || "",
      username: localStorage.getItem("username") || "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("https://your-backend-url/api/login", {
        email: data.email,
        password: data.password,
      });
  
      if (response.status === 200 && response.data.success) {
        setEmailError(false);
        const value = {
          email: data.email,
          password: data.password,
        };
        dispatch(login(value));
        localStorage.setItem("credentials", JSON.stringify(value));
        navigate("/admin-dashboard");
      } else {
        setEmailError(true); // Show error if login fails
      }
    } catch (error) {
      console.error("Login error:", error);
      setEmailError(true); // Show error if there's a network or server error
    }
  };
  useEffect(() => {
    setValue("email", localStorage.getItem("email") || "");
    setValue("password", localStorage.getItem("password") || "");
  }, []);

  const [eye, setEye] = useState(true);

  const onEyeClick = () => {
    setEye(!eye);
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <Link to="/job-list" className="btn btn-primary apply-btn">
            Apply Job
          </Link>
          <div className="container">
            {/* Account Logo */}
            <div className="account-logo">
                <img src={Applogo} alt="Spark CRM" />
            </div>
            {/* /Account Logo */}
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Login</h3>
                <p className="account-subtitle">Access to our dashboard</p>
                {/* Account Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-block mb-4">
                    <label className="col-form-label">Email Address</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          className={`form-control ${
                            errors?.email ? "error-input" : ""
                          }`}
                          type="text"
                          {...field}
                          autoComplete="true"
                        />
                      )}
                    />
                    <span className="text-danger">{errors.email?.message}</span>
                  </div>
                  <div className="input-block mb-4">
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Password</label>
                      </div>
                      <div className="col-auto">
                        <Link className="text-muted" to="/forgot-password">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <input
                            className={`form-control ${
                              errors?.password ? "error-input" : ""
                            }`}
                            type={eye ? "password" : "text"}
                            {...field}
                          />
                        )}
                      />
                      <span
                        style={{
                          position: "absolute",
                          right: "5%",
                          top: "30%",
                        }}
                        onClick={onEyeClick}
                        className={`fa-solid ${
                          eye ? "fa-eye-slash" : "fa-eye"
                        } `}
                      />
                    </div>
                    <span className="text-danger">
                      {errors.password?.message}
                    </span>
                  </div>
                  {emailError && (
                    <div className="alert alert-danger">
                      Invalid email or password.
                    </div>
                  )}
                  <div className="input-block text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="account-footer">
                  <p>
                    Don't have an account yet? <Link to="/register">Register</Link>
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

export default Login;
