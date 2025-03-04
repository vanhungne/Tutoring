import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const useRegisterForm = () => {
  const schema = yup
    .object({
      userName: yup
        .string()
        .required("User Name is required")
        .min(5, "User Name must be at least 5 characters")
        .matches(/^[a-zA-Z0-9]+$/, "User Name does not include character"),

      fullName: yup
        .string()
        .required("Full Name is required")
        .min(10, "Full Name must be at least 10 characters")
        .matches(/^[a-zA-Z0-9]+$/, "User Name does not include character"),
      email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email")
        .matches(
          /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/,
          "Email must be a valid Gmail or FPT email"
        ),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      phone: yup
        .string()
        .required("Phone is required")
        .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
      address: yup.string().required("Address is required"),
      dob: yup
        .date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be a future date")
        .test("age", "You must be at least 16 years old", (value) => {
          if (!value) return false;
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          return age >= 16;
        }),
      avatarFile: yup.mixed().test("fileSize", "File too large", (value) => {
        return !value || (value[0] && value[0].size <= 2 * 1024 * 1024);
      }),
    })
    .required();

  return useForm({
    resolver: yupResolver(schema),
  });
};

export default useRegisterForm;
