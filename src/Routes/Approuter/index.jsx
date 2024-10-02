import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import store from "../../store";
import { Provider } from "react-redux";
import Login from "../../views/pages/Authentication/Login";
import { AuthProvider } from "../../AuthContext";
import ProtectedRoute from "../../ProtectedRoute";
import PublicRoute from "../PublicRoute";
import AdminDashboard from "../../views/pages/MainPages/Dashboard/AdminDashboard/adminDashboard";
import Ticket from "../../views/pages/Employees/Ticket";
import TicketDetails from "../../views/pages/Employees/TicketDetails";
import Header from "../../views/layout/Header";
import Sidebar from "../../views/layout/Sidebar";
import { Outlet } from "react-router-dom";
import EmployeeDashboard from "../../views/pages/MainPages/Dashboard/EmployeeDashboard";
import Chat from "../../views/pages/MainPages/Apps/chat";
import TimeSheet from "../../views/pages/Employees/TimeSheet";
import ContactsList from "../../views/pages/Crm/ContactList";
import ContactDetails from "../../views/pages/Crm/ContactDetails";
import Companies from "../../views/pages/Crm/companies";
import Activities from "../../views/pages/Administration/Activities";
import Users from "../../views/pages/Administration/Users";
import UsersDetails from "../../views/pages/Administration/Users/UsersDetails";
import Profile from "../../views/pages/Profile/Profile";
import ClosedTicket from "../../views/pages/Employees/ClosedTicket";
import OnHoldTicket from "../../views/pages/Employees/OnHoldTicket";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const AppRouter = () => {
    const SidebarLayout = () => (
        <>
          <Header />
          <Sidebar />
          <Outlet />
        </>
      );

    return (
        <Provider store={store}>
            <BrowserRouter basename="/">
                <AuthProvider>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/login" element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } />
                        {/* <Route path="/register" element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        } /> */}
                        {/* <Route path="/otp" element={<Otp />} />
                        <Route path="/error-404" element={<Error404 />} />
                        <Route path="/error-500" element={<Error500 />} />
                        <Route path="/coming-soon" element={<ComingSoon />} />
                        <Route path="/under-maintenance" element={<UnderManitenance />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/lock-screen" element={<LockScreen />} />
                        <Route path="/job-list" element={<JobList />} />
                        <Route path="/job-view" element={<JobView />} /> */}
                        <Route path="/employee-dashboard" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin-dashboard" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                                <SidebarLayout />
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/chat" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <Chat />
                            </ProtectedRoute>
                        } />
                        <Route path="/timesheet" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                                <SidebarLayout />
                                <TimeSheet />
                            </ProtectedRoute>
                        } />
                        <Route path="/tickets" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <Ticket />
                            </ProtectedRoute>
                        } />
                            <Route path="/closed-tickets" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <ClosedTicket />
                            </ProtectedRoute>
                        } />
                        <Route path="/onhold-tickets" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <OnHoldTicket />
                            </ProtectedRoute>
                        } />
                        <Route path="/ticket-details/:id" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <TicketDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/contact-list" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <ContactsList />
                            </ProtectedRoute>
                        } />
                        <Route path="/contact-details/:id" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <ContactDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/companies" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Agent']}>
                                <SidebarLayout />
                                <Companies />
                            </ProtectedRoute>
                        } />
                        <Route path="/activities" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                                <SidebarLayout />
                                <Activities />
                            </ProtectedRoute>
                        } />
                        <Route path="/users" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <SidebarLayout />
                                <Users />
                            </ProtectedRoute>
                        } />
                        <Route path="/users-details/:id" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <SidebarLayout />
                                <UsersDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/unauthorized" element={<Navigate to="/employee-dashboard" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                    </AuthProvider>
            </BrowserRouter>
        </Provider>
    );
};

export default AppRouter;
