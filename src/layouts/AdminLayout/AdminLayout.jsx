import { Outlet } from "react-router-dom";
import SidebarAdmin from "../Sidebar-Admin/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar left */}
      <SidebarAdmin />

      {/* content right */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
