// public routes
export const PATH = {
  // AUTH
  AUTH: "auth",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGERPASSWORD: "/auth/forgetPassword",
  RESETPASSWORD: "/auth/resetPassword",
  RoleSelection: "/auth/select-role",
  VERIFICATION: "/auth/verify",
  LOGINSUCCESS: "/auth/login-success",

  // HOME (Customer)
  HOME: "/",
  APPLY_TUTOR: "/applyTutor",
  FIND_TUTOR: "/findTutor",
  FAVORITE_TUTOR: "/favorite_tutor",
  MESSAGE_PAGE:"chat/message",
  WATTING_TUTOR: "/watting",
  TUTOR_DETAILS: "/tutor/:tutorId",
  PAYMENT: "/payment/:bookingId",
  PAYMENT_RETURN:"/payment/paypal_return",
  PAYMENT_SUCCESS: "/payment-success/:bookingId",
  ORDER_HISTORY: "/order-history",

  // INSTRUCTOR
  TUTOR: "/tutor",
  LESSON: "/tutor/lesson",
  SCHEDULE: "/tutor/schedule/:userName",
  // ANALYTICS: "/analytics",
  INSTRUCTOR_PROFILE: "/instructor_profile",

  //  Manager
  MANAGER: "/manager",
  PRODUCTS: "/manager/products",
  MANAGER_SCHEDULE: "/manager/schedule",
  LANGUAGE: "/manager/language",
  TRANSACTION:"/manager/transaction",


  //Student
  STUDENT: "/student/profile",
  STUDENT_COURSE: "/student/course",

  //Admin
  ADMIN: "/admin",
  USERS: "/admin/users",


};
