// import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
// import UserFilter from "./UserFilter";
import UsersTable from "./UsersTable";
import AddUserModal from "../../../../components/Administration/Users/AddUseModal";
import { useAuth } from '../../../../AuthContext';

const Users = () => {
  const { authState } = useAuth();
  // const [filters, setFilters] = useState({});

  // const handleFilterChange = (values) => {
  //   setFilters(values);
  // };

  return (
    <div className="page-wrapper">
      {authState.role !== 'Admin' ? (
        <div>
          <p>
            This section is available to admin users only.
          </p>
        </div>
      ) : (
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Users"
            title="Dashboard"
            subtitle="Users"
            modal="#add_user"
            name="Add User"
          />
          {/* <UserFilter onFilterChange={handleFilterChange} /> */}
          <UsersTable />
          <AddUserModal />
        </div>
      )}
    </div>
  );
  
};

export default Users;
