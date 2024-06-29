import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AppContainer from "../Appcontainer";
import store from "../../store";
import { Provider } from "react-redux";
import Login from "../../views/pages/Authentication/Login";
import Register from "../../views/pages/Authentication/Register";
import Otp from "../../views/pages/Authentication/Otp";
import Error404 from "../../views/pages/Error/Error404";
import Error500 from "../../views/pages/Error/Error500";
import JobList from "../../views/pages/Authentication/JobList";
import JobView from "../../views/pages/Authentication/JobView";
import ChangePassword from "../../views/pages/Authentication/ChangePassword";
import ForgotPassword from "../../views/pages/Authentication/ForgotPassword";
import LockScreen from "../../views/pages/Authentication/LockScreen";
import Accordions from "../../views/pages/Ui_Interface/Components/Accordions";
import Alerts from "../../views/pages/Ui_Interface/Components/Alerts";
import Breadcrumbs from "../../views/pages/Ui_Interface/Components/Breadcrumbs";
import Avatar from "../../views/pages/Ui_Interface/Components/Avatar";
import Badges from "../../views/pages/Ui_Interface/Components/Badges";
import ButtonCard from "../../views/pages/Ui_Interface/Components/ButtonCard";
import ButtonGroup from "../../views/pages/Ui_Interface/Components/ButtonGroup";
import Cards from "../../views/pages/Ui_Interface/Components/Cards";
import Dropdowns from "../../views/pages/Ui_Interface/Components/Dropdowns";
import Grid from "../../views/pages/Ui_Interface/Components/Grid";
import Images from "../../views/pages/Ui_Interface/Components/Images";
import Media from "../../views/pages/Ui_Interface/Components/Media";
import Modals from "../../views/pages/Ui_Interface/Components/Modals";
import Offcanvas from "../../views/pages/Ui_Interface/Components/Offcanvas";
import Pagination from "../../views/pages/Ui_Interface/Components/Pagination";
import Popover from "../../views/pages/Ui_Interface/Components/Popover";
import Progress from "../../views/pages/Ui_Interface/Components/Progress";
import Placeholder from "../../views/pages/Ui_Interface/Components/Placeholder";
import RangeSlider from "../../views/pages/Ui_Interface/Components/RangeSlider";
import Spinners from "../../views/pages/Ui_Interface/Components/Spinners";
import SweetAlert from "../../views/pages/Ui_Interface/Components/SweetAlert";
import Tabs from "../../views/pages/Ui_Interface/Components/Tabs";
import Toats from "../../views/pages/Ui_Interface/Components/Toats";
// import Tooltip from "../../views/pages/Ui_Interface/Components/Tooltip";
import Typography from "../../views/pages/Ui_Interface/Components/Typography";
import Videos from "../../views/pages/Ui_Interface/Components/Videos";
import Lightbox from "../../views/pages/Ui_Interface/Components/Lightbox";
import Carousel from "../../views/pages/Ui_Interface/Components/Carousel";
import { Navigate } from "react-router-dom/dist";
import Borders from "../../views/pages/Ui_Interface/Components/Borders";
import Breadcrumb from "../../views/pages/Ui_Interface/Components/Breadcrumb";
import Colors from "../../views/pages/Ui_Interface/Components/colors";
import UiModals from "../../views/pages/Ui_Interface/Components/uimodals";
import Spinner from "../../views/pages/Ui_Interface/Components/Spinner";
import Tooltips from "../../views/pages/Ui_Interface/Components/Tooltip";
import ComingSoon from "../../views/pages/Pages/ComingSoon";
import UnderManitenance from "../../views/pages/Pages/UnderManitenance";
// import Ticket from "../../views/pages/Employees/Ticket";
// import TicketDetails from "../../views/pages/Employees/TicketDetails";
// import routingObjects from "../Appcontainer/index"

import { AuthProvider } from "../../AuthContext";
import ProtectedRoute from "../../ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRouter = () => {
  useEffect(() => {
    localStorage.setItem("email", "");
    localStorage.setItem("password", "");
  }, []);
  
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter basename="/">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/error-404" element={<Error404 />} />
            <Route path="/error-500" element={<Error500 />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/under-maintenance" element={<UnderManitenance />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/lock-screen" element={<LockScreen />} />
            <Route path="/job-list" element={<JobList />} />
            <Route path="/job-view" element={<JobView />} />

            <Route path="/*" element={
              <ProtectedRoute>
                <AppContainer />
              </ProtectedRoute>
            } />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/accordion" element={
              <ProtectedRoute>
                <Accordions />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="/breadcrumbs" element={
              <ProtectedRoute>
                <Breadcrumbs />
              </ProtectedRoute>
            } />
            <Route path="/avatar" element={
              <ProtectedRoute>
                <Avatar />
              </ProtectedRoute>
            } />
            <Route path="/badges" element={
              <ProtectedRoute>
                <Badges />
              </ProtectedRoute>
            } />
            <Route path="/buttons" element={
              <ProtectedRoute>
                <ButtonCard />
              </ProtectedRoute>
            } />
            <Route path="/buttongroup" element={
              <ProtectedRoute>
                <ButtonGroup />
              </ProtectedRoute>
            } />
            <Route path="/cards" element={
              <ProtectedRoute>
                <Cards />
              </ProtectedRoute>
            } />
            <Route path="/dropdowns" element={
              <ProtectedRoute>
                <Dropdowns />
              </ProtectedRoute>
            } />
            <Route path="/grid" element={
              <ProtectedRoute>
                <Grid />
              </ProtectedRoute>
            } />
            <Route path="/images" element={
              <ProtectedRoute>
                <Images />
              </ProtectedRoute>
            } />
            <Route path="/media" element={
              <ProtectedRoute>
                <Media />
              </ProtectedRoute>
            } />
            <Route path="/modal" element={
              <ProtectedRoute>
                <Modals />
              </ProtectedRoute>
            } />
            <Route path="/offcanvas" element={
              <ProtectedRoute>
                <Offcanvas />
              </ProtectedRoute>
            } />
            <Route path="/pagination" element={
              <ProtectedRoute>
                <Pagination />
              </ProtectedRoute>
            } />
            <Route path="/popover" element={
              <ProtectedRoute>
                <Popover />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } />
            <Route path="/placeholders" element={
              <ProtectedRoute>
                <Placeholder />
              </ProtectedRoute>
            } />
            <Route path="/rangeslider" element={
              <ProtectedRoute>
                <RangeSlider />
              </ProtectedRoute>
            } />
            <Route path="/spinners" element={
              <ProtectedRoute>
                <Spinners />
              </ProtectedRoute>
            } />
            <Route path="/sweetalert" element={
              <ProtectedRoute>
                <SweetAlert />
              </ProtectedRoute>
            } />
            <Route path="/nav-tabs" element={
              <ProtectedRoute>
                <Tabs />
              </ProtectedRoute>
            } />
            <Route path="/toastr" element={
              <ProtectedRoute>
                <Toats />
              </ProtectedRoute>
            } />
            <Route path="/tooltips" element={
              <ProtectedRoute>
                <Tooltips />
              </ProtectedRoute>
            } />
            <Route path="/typography" element={
              <ProtectedRoute>
                <Typography />
              </ProtectedRoute>
            } />
            <Route path="/video" element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            } />
            <Route path="/lightbox" element={
              <ProtectedRoute>
                <Lightbox />
              </ProtectedRoute>
            } />
            <Route path="/carousel" element={
              <ProtectedRoute>
                <Carousel />
              </ProtectedRoute>
            } />
            <Route path="/borders" element={
              <ProtectedRoute>
                <Borders />
              </ProtectedRoute>
            } />
            <Route path="/breadcrumb" element={
              <ProtectedRoute>
                <Breadcrumb />
              </ProtectedRoute>
            } />
            <Route path="/colors" element={
              <ProtectedRoute>
                <Colors />
              </ProtectedRoute>
            } />
            <Route path="/modals" element={
              <ProtectedRoute>
                <UiModals />
              </ProtectedRoute>
            } />
            <Route path="/spinner" element={
              <ProtectedRoute>
                <Spinner />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
};

export default AppRouter;