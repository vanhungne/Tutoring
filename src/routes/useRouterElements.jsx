import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgetPassword from "../pages/Auth/ForgetPassword/ForgetPassword";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../pages/Home/HomePage/HomePage";
import Verification from "../pages/Auth/Verification/verification";
import Instructor_Profile from "../pages/Home/Profile/Instructor_profile/InstructorProfile";
// import Student_Profile from "../pages/Home/Profile/Student_profile/StudentProfile";
import MessagesPage from "../pages/Feature/Chat/MessagePage.jsx";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import ApplyTutorPage from "../pages/Feature/ApplyTutor/ApplyTutorPage";
import TutorUpgradeRequests from "../pages/Feature/TutorUpgradeRequests/TutorUpgradeRequests";
import OverviewPage from "../pages/Dashboard/ManagerDashboard/OverviewPage";
import ProductsPage from "../pages/Dashboard/ManagerDashboard/ProductsPage";
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import FindTutor from "../pages/Home/FindTuor/FindTutor";
import UsersPage from "../pages/Dashboard/ManagerDashboard/UsersPage";
import TutorView from "../pages/Dashboard/TutorDashboard/TutorView";
import TutorLayout from "../layouts/TutorLayout/TutorLayout";
import TutorLesson from "../pages/Dashboard/TutorDashboard/TutorLesson";
import TutorSchedule from "../pages/Dashboard/TutorDashboard/TutorSchedule";

import FavoriteTutor from "../pages/Home/FavoriteTutor/FavoriteTutor";
import StudentLayout from "../layouts/StudentLayout/StudentLayout";
import StudentProfile from "../pages/Home/Profile/Student_profile/StudentProfile";
import ManagerSchedule from "../pages/Dashboard/ManagerDashboard/ManagerSchedule";
import RoleSelection from "../pages/Auth/Login/RoleSelection.jsx";
import LoginSuccess from "../pages/Auth/Login/LoginSuccess.jsx";
import AdminLayout from "../layouts/AdminLayout/AdminLayout.jsx";
import AdminView from "../pages/Dashboard/AdminDashboard/AdminView.jsx";
import OrdersPage from "../pages/Dashboard/ManagerDashboard/LanguagePage.jsx";
import LanguageTable from "../pages/Dashboard/ManagerDashboard/LanguageTable.jsx";
import TransactionsPage from "../pages/Dashboard/ManagerDashboard/TransactionPage.jsx";
import PendingApprovalPage from "../pages/Auth/Login/PendingApprovalPage.jsx";
import TutorDetailsPage from "../pages/Feature/TutorDetails/TutorDetailsPage";
import PaymentPage from "../pages/Feature/Payment/PaymentPage.jsx";
import PaypalReturn from "../pages/Feature/Payment/PaypalReturn.jsx";
import PaymentSuccessPage from "../pages/Feature/Payment/PaymentSuccessPage.jsx";
import OrderHistoryPage from "../pages/Feature/Payment/OrderHistoryPage.jsx";
// import SalesPage from "../pages/Dashboard/SalesPage"
// import OrdersPage from "../pages/Dashboard/OrdersPage"
// import AnalyticsPage from "../pages/Dashboard/AnalyticsPage"
// import SettingsPage from "../pages/Dashboard/SettingsPage"

export default function useRouterElements() {
  const element = useRoutes([
    // auth
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: <Login />,
        },
        {
          path: PATH.REGISTER,
          element: <Register />,
        },
        {
          path: PATH.FORGERPASSWORD,
          element: <ForgetPassword />,
        },
        {
          path: PATH.RESETPASSWORD,
          element: <ResetPassword />,
        },
        {
          path: PATH.VERIFICATION,
          element: <Verification />,
        },
        {
          path: PATH.RoleSelection,
          element: <RoleSelection />,
        },
        {
          path: PATH.LOGINSUCCESS,
          element: <LoginSuccess/>
        }
      ],
    },

    // home
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },{
          path:PATH.WATTING_TUTOR,
          element:<PendingApprovalPage/>
        },
        {
          path: PATH.INSTRUCTOR_PROFILE,

          element: <Instructor_Profile />,
        },

        {
          path: PATH.MESSAGE_PAGE,
          element: <MessagesPage />,
        },
        {
          path: PATH.APPLY_TUTOR,
          element: <ApplyTutorPage />,
        },
        {
          path: PATH.FIND_TUTOR,
          element: <FindTutor />,
        },
        {
          path: PATH.FAVORITE_TUTOR,
          element: <FavoriteTutor />,
        },
        {
          path: PATH.TUTOR_DETAILS,
          element: <TutorDetailsPage />,
        },
        {
          path: PATH.PAYMENT,
          element: <PaymentPage />,
        },
        {
          path: PATH.PAYMENT_RETURN,
          element: <PaypalReturn/>
        },
        {
          path: "/payment-success/:bookingId",
          element: <PaymentSuccessPage />
        },
        {
          path: "/order-history",
          element: <OrderHistoryPage />
        },
      ],
    },

    // instructor
    {
      path: PATH.TUTOR,
      element: <TutorLayout />,
      children: [
        {
          index: true,
          element: <TutorView />,
        },
        {
          path: PATH.LESSON,
          element: <TutorLesson />,
        },
        {
          path: "/tutor/schedule/",
          element: <TutorSchedule />,
        },
      ],
    },

    // admin
    {
      path:PATH.ADMIN,
      element:<AdminLayout/>,
      children: [
        {
          index: true,
          element: <AdminView/>,
        },
        {
          path: PATH.USERS,
          element: <UsersPage />,
        },

      ],
    },
    //student
    {
      path:PATH.STUDENT,
      element:<StudentLayout/>,
      children: [
        {
          index: true,
          element: <StudentProfile/>,
        },

      ],
    },
    // manager
    {
      path: PATH.MANAGER,
      element: <ManagerLayout />,
      children: [
        {
          index: true,
          element: <OverviewPage />,
        },
        {
          path: PATH.PRODUCTS,
          element: <ProductsPage />,
        },

        {
          path: PATH.MANAGER_SCHEDULE,
          element: <ManagerSchedule />,
        },
        {
          path: PATH.LANGUAGE,
          element: <LanguageTable />,
        },
        {
          path: PATH.MANAGER,
          element: <OrdersPage/>
        },
        {
          path: PATH.TRANSACTION,
          element: <TransactionsPage/>
        },
      ],
    },
    {
      path: "/tutor-upgrade",
      element: <TutorUpgradeRequests />,
    },
  ]);
  return element;
}
