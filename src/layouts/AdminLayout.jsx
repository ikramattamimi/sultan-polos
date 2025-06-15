import React from 'react';
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const AdminLayout = () => {
  return (
    <div>
      <div className="fixed w-[250px]">
        <Sidebar />
      </div>

      <div className="flex gap-5">
        <div className="w-[250px]">
          <div className="w-[250px]"></div>
        </div>

        <div className="m-5 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;