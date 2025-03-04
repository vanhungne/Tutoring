import { TextField, Button } from "@mui/material";
import * as yup from "yup";
import "./ForgetPassword.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { forgetPassWordApi } from "../../../stores/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is not required"),
  })
  .required();

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // render api
  const onSubmit = async (data) => {
    // Lưu email vào localStorage
    localStorage.setItem("userEmail", data.email);

    toast.loading("Sending password reset email...");
    const resultAction = await dispatch(forgetPassWordApi(data));
    toast.dismiss();
    if (forgetPassWordApi.fulfilled.match(resultAction)) {
      navigate("/auth/verify", { state: { email: data.email } });
    } else {
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-10 rounded-lg w-96">
        <h2 className="text-5xl font-bold mb-4">Forgot your password?</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="outlined-basic"
            label="Your Email"
            variant="outlined"
            fullWidth
            className="mb-5"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            fullWidth
            variant="contained"
            className="forgetPassword-button"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
