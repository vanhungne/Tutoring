import { Outlet } from "react-router-dom";
import ManagerSidebar from "../Sidebar-Manager/SidebarManager";

const ManagerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar left */}
      <ManagerSidebar />

      {/* content right */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
