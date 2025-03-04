import { Outlet } from "react-router-dom";
// import Sidebar from "../../components/common/Sidebar";
import SidebarTutor from "../Sidebar-Tutor/SidebarTutor";

const TutorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar left */}
      <SidebarTutor />

      {/* content right */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default TutorLayout;
