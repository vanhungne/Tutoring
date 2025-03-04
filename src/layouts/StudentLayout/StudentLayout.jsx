import { Outlet } from "react-router-dom";
import StudentSidebar from "../Sidebar-Student/SidebarStudent";

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar left */}
      <StudentSidebar />

      {/* content right */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
