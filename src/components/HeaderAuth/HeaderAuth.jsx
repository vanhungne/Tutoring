import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
    Avatar,
    Box,
    Button,
    FormControl,
    Menu,
    MenuItem,
    Paper,
    Select,
    Badge,
    Popover,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import logo from "../../assets/image/tải xuống.png";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch, useSelector } from "react-redux";
import { getUnreadMessageCount } from "../../stores/slices/chatSlice";

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const languages = ["English", "Vietnamese", "Spanish", "French"];
    const currencies = ["USD", "EUR", "VND", "JPY"];
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [anchorMenu, setAnchorMenu] = useState(null);
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);
    const { totalUnreadCount } = useSelector((state) => state.chat);

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsLoggedIn(true);
            // Fetch unread message count when user is logged in
            dispatch(getUnreadMessageCount());
        }
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/auth/login");
    };

    const handleMenuClick = (event) => setAnchorMenu(event.currentTarget);
    const handleMenuClose = () => setAnchorMenu(null);

    const handleUserMenuClick = (event) => setAnchorUserMenu(event.currentTarget);
    const handleUserMenuClose = () => setAnchorUserMenu(null);

    const handleBecomeTutorClick = () => {
        navigate("applyTutor");
    };

    const handleChatClick = () => {
        navigate("/chat/message");
    };

    const handleOrderHistoryClick = () => {
        navigate("/order-history");
        handleUserMenuClose();
    };

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar style={{ justifyContent: "space-between" }}>
                {/* Left Side */}
                <Box className="header-left flex items-center gap-5">
                    <Typography
                        variant="h6"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="Preply Logo"
                            style={{ height: 50, marginRight: 8 }}
                        />
                    </Typography>
                    <Box
                        className="header-title flex gap-5"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                        <Typography
                            onClick={() => navigate("/findTutor")}
                            style={{ cursor: "pointer" }}
                        >
                            Find Tutor
                        </Typography>
                        <Typography>Corporate language training</Typography>
                        <Typography
                            onClick={handleBecomeTutorClick}
                            style={{ cursor: "pointer" }}
                        >
                            Become a tutor
                        </Typography>
                    </Box>
                </Box>

                {/* Right Side */}
                <Box
                    className="header-menu"
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                    <Box
                        className="header-menuList"
                        onClick={handleMenuClick}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            transition: "all 0.3s",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#333",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {selectedLanguage}, {selectedCurrency} <KeyboardArrowDownIcon />
                        </Typography>
                    </Box>
                    <Menu
                        anchorEl={anchorMenu}
                        open={Boolean(anchorMenu)}
                        onClose={handleMenuClose}
                        sx={{ mt: 1 }}
                        PaperProps={{
                            sx: {
                                width: 250,
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        <Paper
                            sx={{
                                padding: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                boxShadow: "none",
                            }}
                        >
                            {/* Language Selection */}
                            <FormControl fullWidth>
                                <Typography>Language</Typography>
                                <Select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    onClose={handleMenuClose}
                                >
                                    {languages.map((lang) => (
                                        <MenuItem key={lang} value={lang}>
                                            {lang}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Currency Selection */}
                            <FormControl fullWidth>
                                <Typography>Currency</Typography>
                                <Select
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                    onClose={handleMenuClose}
                                >
                                    {currencies.map((curr) => (
                                        <MenuItem key={curr} value={curr}>
                                            {curr}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Menu>
                    <HelpOutlineIcon sx={{ fontSize: "22px" }} />

                    <FavoriteIcon
                        sx={{ fontSize: "22px", cursor: "pointer" }}
                        onClick={() => navigate(PATH.FAVORITE_TUTOR)}
                    />

                    {isLoggedIn && (
                        <Badge badgeContent={totalUnreadCount} color="error" sx={{ cursor: "pointer" }}>
                            <ChatIcon onClick={handleChatClick} sx={{ fontSize: "22px" }} />
                        </Badge>
                    )}

                    {isLoggedIn ? (
                        // Show Avatar and Logout button when logged in
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Avatar
                                alt={user?.name || "User"}
                                src={user?.Avatar || ""}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: "#3f51b5",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                                onClick={handleUserMenuClick}
                            >
                                {!user?.Avatar && user?.name ? user.name.charAt(0) : ""}
                            </Avatar>

                            <Menu
                                anchorEl={anchorUserMenu}
                                open={Boolean(anchorUserMenu)}
                                onClose={handleUserMenuClose}
                                PaperProps={{
                                    elevation: 3,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        width: 200,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => navigate('/profile')}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <MenuItem onClick={handleOrderHistoryClick}>
                                    <HistoryIcon sx={{ mr: 1 }} /> Order History
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                                </MenuItem>
                            </Menu>

                            <Button
                                className="bg-slate-600 h-10 w-20"
                                onClick={handleLogout}
                                sx={{
                                    border: "solid 2px black",
                                    color: "black",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                }}
                            >
                                <LogoutIcon sx={{ fontSize: "15px", marginRight: "10px" }} />
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        // Show Login button when logged out
                        <Link to="/auth/login">
                            <Button
                                className="bg-slate-600 h-10 w-20"
                                sx={{
                                    border: "solid 2px black",
                                    color: "black",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                }}
                            >
                                <ArrowForwardIcon
                                    sx={{ fontSize: "15px", marginRight: "10px" }}
                                />
                                Login
                            </Button>
                        </Link>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;