import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Checkbox,
  IconButton,
  Alert,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../../../apis/firebase"; // Import Firebase Auth
import { getDoc, doc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import requests from "../../../Utils/requests.js";
import toast from "react-hot-toast";
import { useEffect } from "react";
// import { ROLE } from "../../../constants/index.jsx";
// import { decode as jwt_decode } from "jwt-decode";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      dispatch(loginSuccess(user)); // Restore user state in Redux
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Hàm kiểm tra role từ Firestore
  const getUserRole = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().role : null;
  };

  const handleGoogleLogin = () => {
    // Redirect trực tiếp tới API endpoint
    window.location.href = "https://localhost:7184/api/GoogleAuth/login";
  };
  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   provider.setCustomParameters({ prompt: "select_account" });

  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     const role = await getUserRole(user.uid);
  //     localStorage.setItem("user", JSON.stringify(user));

  //     if (role === ROLE.TUTOR) {
  //       navigate("/intructorPage");
  //     } else if (role === ROLE.STUDENT) {
  //       navigate("/");
  //     } else {
  //       toast.error("User role not recognized!");
  //     }
  //   } catch (error) {
  //     console.error("Google Login Error:", error.message);
  //     toast.error("Login Failed: " + error.message);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      console.log("Submitting login with:", data);

      const response = await requests.post("Authen/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.code === 200) {
        // Store the token in local storage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            accessToken: response.data.accessToken,
            email: data.email,
          })
        );

        // Show success message
        toast.success("Login success");

        // Redirect to dashboard or home page
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.message === "Network error - please check your connection") {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // console.log(localStorage./("currentUser"));




  return (
    <Box className="login-container">
      <Typography variant="h4" className="login-title">
        Log in
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box className="login-links">
        <Link
          to="/auth/register"
          underline="hover"
          variant="body2"
          style={{ color: "black", textDecoration: "underline" }}
          className="login-link"
        >
          Sign up as a student
        </Link>
        <Typography variant="body2">or</Typography>
        <Link
          to="/auth/login"
          underline="hover"
          variant="body2"
          style={{ color: "black", textDecoration: "underline" }}
          className="login-link"
        >
          Sign up as a tutor
        </Link>
      </Box>

      <Box>
        <Button
          fullWidth
          startIcon={<Google />}
          variant="outlined"
          className="login-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </Button>
      </Box>

      <Divider className="login-divider">or</Divider>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            className="login-input"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            className="login-input"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <Box className="login-options">
            <Link
              to="/auth/forgetPassword"
              underline="hover"
              variant="body2"
              style={{ color: "black", textDecoration: "underline" }}
              className="login-link"
            >
              Forgot password
            </Link>
            <Box className="remember-me">
              <Checkbox size="small" />
              <Typography variant="body2">Remember me</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            className="login-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <Typography variant="body2" className="login-footer">
          By clicking Log in or Continue with, you agree to ABCD <br />
          <Link
            to=""
            underline="hover"
            variant="body2"
            style={{ color: "black" }}
            className="login-link"
          >
            Terms of Use
          </Link>
          and{" "}
          <Link
            to=""
            underline="hover"
            variant="body2"
            style={{ color: "black" }}
            className="login-link"
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
