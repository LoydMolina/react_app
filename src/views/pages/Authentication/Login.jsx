import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../../AuthContext";

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
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: localStorage.getItem("email") || "",
            password: localStorage.getItem("password") || "",
        },
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState(false);
    const [eye, setEye] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setEmailError(false);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                // Set clock-in status here
                localStorage.setItem("clockedIn", "true");
                // Navigate based on role
                if (result.role === 'Agent') {
                    navigate("/employee-dashboard");
                }
            } else {
                setEmailError(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setEmailError(true);
        } finally {
            setLoading(false);
        }
    };

    const onEyeClick = () => {
        setEye(!eye);
    };

    return (
        <div className="account-page">
            <div className="main-wrapper">
                <div className="account-content">
                    <div className="container">
                        <div className="account-logo">
                            <img src={Applogo} alt="Spark CRM" />
                        </div>
                        <div className="account-box">
                            <div className="account-wrapper">
                                <h3 className="account-title">Login</h3>
                                <p className="account-subtitle">Access to our dashboard</p>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="input-block mb-4">
                                        <label className="col-form-label">Email Address</label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    className={`form-control ${
                                                        errors.email ? "error-input" : ""
                                                    }`}
                                                    type="text"
                                                    {...field}
                                                    autoComplete="email"
                                                    placeholder="Enter your email"
                                                />
                                            )}
                                        />
                                        <span className="text-danger">{errors.email?.message}</span>
                                    </div>
                                    <div className="input-block mb-4">
                                        <label className="col-form-label">Password</label>
                                        <div style={{ position: "relative" }}>
                                            <Controller
                                                name="password"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        className={`form-control ${
                                                            errors.password ? "error-input" : ""
                                                        }`}
                                                        type={eye ? "password" : "text"}
                                                        {...field}
                                                        placeholder="Enter your password"
                                                    />
                                                )}
                                            />
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    right: "5%",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    cursor: "pointer",
                                                }}
                                                onClick={onEyeClick}
                                                className={`fa-solid ${
                                                    eye ? "fa-eye-slash" : "fa-eye"
                                                }`}
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
                                            disabled={loading}
                                        >
                                            {loading ? "Logging in..." : "Login"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
