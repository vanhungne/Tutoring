import { TextField, Button } from "@mui/material";
import * as yup from "yup";
import "./ResetPassword.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPasswordApi } from "../../../stores/slices/authSlice";
import toast from "react-hot-toast";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    NewPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
  })
  .required();

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPasswordApi(data)).unwrap();
      toast.success("Password reset successful!");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Reset password failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-10 rounded-lg w-96">
        <h2 className="text-5xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="email"
            label="Your Email"
            variant="outlined"
            fullWidth
            className="mb-10"
            InputProps={{
              style: { border: "1px solid #ccc", margin: "10px 0" },
            }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            id="password"
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            className="mb-3"
            InputProps={{
              style: { border: "1px solid #ccc", margin: "10px 0" },
            }}
            {...register("NewPassword")}
            error={!!errors.NewPassword}
            helperText={errors.NewPassword?.message}
          />

          <Button
            fullWidth
            variant="contained"
            className="resetPassword-button"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
