import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
// import UserFilter from "./UserFilter";
import UsersTable from "./UsersTable";
import AddUserModal from "../../../../components/Administration/Users/AddUseModal";

const Users = () => {
  // const [filters, setFilters] = useState({});

  // const handleFilterChange = (values) => {
  //   setFilters(values);
  // };

  return (
    <div className="page-wrapper">
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
    </div>
  );
};

export default Users;
