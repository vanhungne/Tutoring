import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyCodeApi } from "../../../stores/slices/authSlice";
import toast from "react-hot-toast";

const Verification = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Yup validation schema
  const schema = yup
    .object({
      otp: yup.string().required("OTP is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const requestData = {
      email: email,
      code: data.otp,
    };
    const resultAction = await dispatch(verifyCodeApi(requestData));
    if (verifyCodeApi.fulfilled.match(resultAction)) {
      toast.success("Verify success");
      navigate("/auth/resetPassword");
    } else {
      toast.error("Verify error, Please verify again ");
    }
  };

  return (
    <Box className="login-container">
      <Typography variant="h4" className="login-title">
        Verification{" "}
      </Typography>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="OTP TOKEN"
            variant="outlined"
            margin="normal"
            {...register("otp")}
            error={!!errors.otp}
            helperText={errors.otp?.message}
            className="login-input"
          />

          <Button
            fullWidth
            variant="contained"
            className="login-submit-btn"
            type="submit"
          >
            Verify{" "}
          </Button>
        </form>
        <Typography variant="body2" className="login-footer">
          By clicking Sign Up or Continue with, you agree to ABCD <br />
          <Link
            href="#"
            underline="hover"
            style={{ color: "black" }}
            className="login-link"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            underline="hover"
            style={{ color: "black" }}
            className="login-link"
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};
export default Verification;
