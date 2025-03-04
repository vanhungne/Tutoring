import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../../components/HeaderAuth/HeaderAuth";


export default function AuthLayout() {
  return (
    <Box>
      <Header/>
        <Outlet/>
    </Box>
  )
}
