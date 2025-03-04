import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../../../apis/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";

import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { registerApi } from "../../../stores/slices/authSlice";
import toast from "react-hot-toast";
import useRegisterForm from "../../../hooks/useRegisterForm";

export default function RegisterStudent() {
  const [showPassword, setShowPassword] = useState(false);
  const [setErrorMessage] = useState("");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // register by email & password
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("UserName", data.userName.trim());
      formData.append("FullName", data.fullName);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("PhoneNumber", data.phone);
      formData.append("Address", data.address);
      formData.append("DOB", new Date(data.dob).toISOString());
      if (data.avatarFile && data.avatarFile.length > 0) {
        formData.append("avatarFile", data.avatarFile[0]);
      } else {
        console.warn("No avatar file selected!");
      }
      const response = await dispatch(registerApi(formData));

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Registration successful! Please confirm email");
    } catch (error) {
      console.error("Register Error:", error);
      if (error.response) {
        console.error("Response Error Data:", error.response.data);
      }
      toast.error("Registration failed, please try again");
    }
  };

  // register by google
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("User đăng nhập bằng Google với role:", role);
        navigate(role === "customer" ? "/" : "/intructorPage");
      } else {
        // if new user show popup choice role
        setGoogleUser(user);
        setShowRolePopup(true);
      }
    } catch (error) {
      console.error("Google Sign Up Error:", error.message);
      setErrorMessage(error.message);
    }
  };

  //  Xác nhận role sau khi đăng ký Google
  const handleConfirmRole = async (selectedRole) => {
    setShowRolePopup(false);

    if (googleUser) {
      const userRef = doc(db, "users", googleUser.uid);
      await setDoc(userRef, {
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        role: selectedRole,
      });

      navigate(selectedRole === "customer" ? "/" : "/intructorPage");
    }
  };

  return (
    <Box className="login-container">
      {isLoading && (
        <Typography className="loading-text">Loading...</Typography>
      )}
      <Typography variant="h4" className="login-title">
        Sign up Customer
      </Typography>
      <Box className="login-links">
        <Typography variant="body2">Already have an account? </Typography>
        <Link to="/auth/login" className="login-link">
          Login
        </Link>
      </Box>

      <Button
        fullWidth
        startIcon={<Google />}
        variant="outlined"
        onClick={handleGoogleSignUp}
      >
        Continue with Google
      </Button>

      <Divider className="login-divider">or</Divider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              margin="normal"
              {...register("userName")}
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full name"
              variant="outlined"
              margin="normal"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              margin="normal"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              type="date"
              {...register("dob")}
              error={!!errors.dob}
              helperText={errors.dob?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleClickShowPassword}>
                    {" "}
                    {showPassword ? <VisibilityOff /> : <Visibility />}{" "}
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
        <input
          type="file"
          accept=".png, .jpeg, .jpg"
          {...register("avatarFile")}
          style={{ margin: "10px 0" }}
        />

        <Box className="login-options">
          <Checkbox size="small" />
          <Typography variant="body2">Remember me</Typography>
        </Box>
        {isLoading && (
          <Typography className="loading-text">Loading...</Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          className="login-submit-btn"
          type="submit"
          disabled={isLoading}
        >
          Sign Up
        </Button>
      </form>

      {/* Popup chọn role sau khi đăng ký Google */}
      {showRolePopup && (
        <>
          <div className="popup-overlay">
            <Box className="popup">
              <Typography variant="h6">Select role to continue</Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleConfirmRole("customer")}
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#3ddabd",
                  border: "solid 2px black",
                  color: "black",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Customer
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleConfirmRole("instructor")}
                style={{
                  marginBottom: "10px",
                  backgroundColor: "#fe7aac",
                  border: "solid 2px black",
                  color: "black",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Instructor
              </Button>
            </Box>
          </div>
        </>
      )}

      <Typography variant="body2" className="login-footer">
        By clicking Sign Up, you agree to ABCD{" "}
        <Link href="#" className="login-link">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="#" className="login-link">
          Privacy Policy
        </Link>
        .
      </Typography>
    </Box>
  );
}
