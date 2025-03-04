import { Box, Card, Grid, Typography, Button, Pagination, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Drawer, IconButton, Slider, Tooltip, InputAdornment, Divider } from "@mui/material";
import "./FindTutor.css";
import React, { useEffect, useState, useRef } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import TranslateIcon from "@mui/icons-material/Translate";
import StarIcon from "@mui/icons-material/Star";
import FilterListIcon from "@mui/icons-material/FilterList";
import Checkbox from '@mui/material/Checkbox';
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch, useSelector } from "react-redux";
import { getListInstructorApi } from "../../../stores/slices/listInstructorSlice";
import { addFavoriteApi } from "../../../stores/slices/favoriteSlice";
import { fetchAllLanguages } from "../../../stores/slices/languageSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createChatRoom } from "../../../stores/slices/chatSlice.js";
import requests from "../../../Utils/requests.js";
import BookingModal from "../../../components/booking/BookingModal";

export default function FindTutor() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const cardRefs = useRef([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Any country");
  const [availability, setAvailability] = useState("Any time");
  const [specialties, setSpecialties] = useState([]);
  const [nativeSpeaker, setNativeSpeaker] = useState(false);
  const [tutorCategories, setTutorCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // call api list instructor
  const { listInstructor, isLoading, error } = useSelector(
      (state) => state.instructor
  );

  // Get languages from the store
  const { languages, isLoading: isLoadingLanguages } = useSelector(
      (state) => state.language
  );

  useEffect(() => {
    dispatch(getListInstructorApi({ pageNumber, pageSize }));
    dispatch(fetchAllLanguages());
    fetchCountries();
  }, [dispatch, pageNumber, pageSize]);

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await requests.get('/Profile/countries');
      if (response.data && response.data.data && response.data.data.$values) {
        setCountries(response.data.data.$values);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
      setCountries([]);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const { favoriteInstructor } = useSelector((state) => state.favorite);

  const isFavorite = (userName) => {
    return favoriteInstructor.some((tutor) => tutor.userName === userName);
  };

  const handleAddFavorite = (userName) => {
    dispatch(addFavoriteApi(userName)).then(() => {
      toast.success("Added to favorites!");
    });
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const handleSendMessage = async (instructorName, e) => {
    e.stopPropagation();
    try {
      await dispatch(createChatRoom({ instructorName }));
      navigate("/chat/message");
    } catch (error) {
      toast.error("Failed to create chat room");
    }
  };

  const handleTutorCardClick = (userName) => {
    navigate(`/tutor/${userName}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleSpecialtyChange = (specialty) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter(item => item !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  const handleNativeSpeakerChange = () => {
    setNativeSpeaker(!nativeSpeaker);
  };

  const handleTutorCategoryChange = (category) => {
    if (tutorCategories.includes(category)) {
      setTutorCategories(tutorCategories.filter(item => item !== category));
    } else {
      setTutorCategories([...tutorCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 100]);
    setSelectedLanguage("");
    setSortOrder("asc");
    setSelectedCountry("Any country");
    setAvailability("Any time");
    setSpecialties([]);
    setNativeSpeaker(false);
    setTutorCategories([]);
  };

  const handleBookLesson = (tutor, e) => {
    e.stopPropagation();
    setSelectedTutor(tutor);
    setBookingModalOpen(true);
  };

  const filteredInstructors = Array.isArray(listInstructor)
      ? listInstructor.filter(tutor =>
          tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedLanguage === "" || tutor.languageId === parseInt(selectedLanguage)) &&
          tutor.price >= priceRange[0] && tutor.price <= priceRange[1] &&
          (selectedCountry === "Any country" || tutor.country?.toLowerCase().includes(selectedCountry.toLowerCase()) || tutor.address?.toLowerCase().includes(selectedCountry.toLowerCase())) &&
          (!nativeSpeaker || (tutor.teachingExperience && tutor.teachingExperience.toLowerCase().includes("native")))
      )
      : [];

  const sortedInstructors = [...filteredInstructors].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else if (sortOrder === "desc") {
      return b.price - a.price;
    } else if (sortOrder === "rating") {
      return b.averageRating - a.averageRating;
    } else if (sortOrder === "lessons") {
      return b.totalLessons - a.totalLessons;
    }
    return 0;
  });

  const specialtyOptions = ["Business English", "Conversation", "IELTS", "TOEFL", "Grammar", "Vocabulary", "Pronunciation", "Reading", "Writing", "Listening"];
  const tutorCategoryOptions = ["Professional", "Community Tutor", "Super Tutor", "New Tutor", "Certified Teacher"];
  const availabilityOptions = ["Any time", "Morning", "Afternoon", "Evening", "Weekend"];

  if (isLoading) return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5">Loading tutors...</Typography>
      </Box>
  );

  if (error) return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">Error: {error}</Typography>
      </Box>
  );

  return (
      <>
        <Box className="findTutor">
          <Box className="findTutor-content">
            <Box className="findTutor-header">
              <Typography variant="h4" fontWeight="600" className="mb-4">
                {sortedInstructors.length} tutors to help you succeed
              </Typography>

              {/* Main Filter Section */}
              <Box className="filter-container mb-6">
                <Grid container spacing={2}>
                  {/* What to learn */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="filter-box">
                      <Typography variant="subtitle2" className="filter-label">I want to learn</Typography>
                      <FormControl fullWidth variant="outlined">
                        <Select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            displayEmpty
                            className="filter-select"
                            endAdornment={
                                selectedLanguage && (
                                    <InputAdornment position="end">
                                      <IconButton
                                          size="small"
                                          onClick={() => setSelectedLanguage("")}
                                          sx={{ marginRight: 1 }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                )
                            }
                        >
                          <MenuItem value="">
                            <em>Select language</em>
                          </MenuItem>
                          {languages.map((language) => (
                              <MenuItem key={language.languageId} value={language.languageId.toString()}>
                                {language.languageName}
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* Price Range */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="filter-box">
                      <Typography variant="subtitle2" className="filter-label">Price per lesson</Typography>
                      <FormControl fullWidth variant="outlined">
                        <Select
                            value={`$${priceRange[0]} – $${priceRange[1]}+`}
                            renderValue={() => `$${priceRange[0]} – $${priceRange[1]}+`}
                            className="filter-select"
                            IconComponent={() => (
                                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
                                  <IconButton size="small">
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                            )}
                            onClick={(e) => e.preventDefault()}
                        >
                          <MenuItem>
                            <Box sx={{ width: '100%', px: 2, py: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Price range: ${priceRange[0]} – ${priceRange[1]}
                              </Typography>
                              <Slider
                                  value={priceRange}
                                  onChange={handlePriceChange}
                                  valueLabelDisplay="auto"
                                  min={0}
                                  max={200}
                                  sx={{
                                    color: '#fe7aac',
                                    '& .MuiSlider-thumb': {
                                      borderRadius: '50%',
                                      height: 20,
                                      width: 20,
                                      border: '2px solid currentColor',
                                    }
                                  }}
                              />
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* Country */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="filter-box">
                      <Typography variant="subtitle2" className="filter-label">Country of birth</Typography>
                      <FormControl fullWidth variant="outlined">
                        <Select
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            className="filter-select"
                            endAdornment={
                                selectedCountry !== "Any country" && (
                                    <InputAdornment position="end">
                                      <IconButton
                                          size="small"
                                          onClick={() => setSelectedCountry("Any country")}
                                          sx={{ marginRight: 1 }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                )
                            }
                        >
                          <MenuItem value="Any country">Any country</MenuItem>
                          {isLoadingCountries ? (
                              <MenuItem disabled>Loading countries...</MenuItem>
                          ) : (
                              countries.map((country) => (
                                  <MenuItem key={country} value={country}>
                                    {country}
                                  </MenuItem>
                              ))
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* Availability */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="filter-box">
                      <Typography variant="subtitle2" className="filter-label">I'm available</Typography>
                      <FormControl fullWidth variant="outlined">
                        <Select
                            value={availability}
                            onChange={handleAvailabilityChange}
                            className="filter-select"
                            endAdornment={
                                availability !== "Any time" && (
                                    <InputAdornment position="end">
                                      <IconButton
                                          size="small"
                                          onClick={() => setAvailability("Any time")}
                                          sx={{ marginRight: 1 }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                )
                            }
                        >
                          {availabilityOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Secondary Filter Section */}
              <Box className="secondary-filters mb-4">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={9}>
                    <Box className="flex flex-wrap gap-2">
                      {/* Specialties Dropdown */}
                      <FormControl variant="outlined" size="small" className="filter-dropdown">
                        <Select
                            value=""
                            displayEmpty
                            renderValue={() => "Specialties"}
                            className="secondary-select"
                            IconComponent={FilterListIcon}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                        >
                          {specialtyOptions.map((specialty) => (
                              <MenuItem key={specialty} value={specialty} onClick={() => handleSpecialtyChange(specialty)}>
                                <Box display="flex" alignItems="center" width="100%">
                                  <Checkbox checked={specialties.includes(specialty)} />
                                  <Typography>{specialty}</Typography>
                                </Box>
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Also Speaks Dropdown */}
                      <FormControl variant="outlined" size="small" className="filter-dropdown">
                        <Select
                            value=""
                            displayEmpty
                            renderValue={() => "Also speaks"}
                            className="secondary-select"
                            IconComponent={FilterListIcon}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                        >
                          {languages.map((language) => (
                              <MenuItem key={language.languageId} value={language.languageId}>
                                <Box display="flex" alignItems="center" width="100%">
                                  <Checkbox checked={false} />
                                  <Typography>{language.languageName}</Typography>
                                </Box>
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Native Speaker Toggle */}
                      <FormControl variant="outlined" size="small" className="filter-dropdown">
                        <Select
                            value={nativeSpeaker ? "yes" : "no"}
                            onChange={handleNativeSpeakerChange}
                            displayEmpty
                            renderValue={() => "Native speaker"}
                            className="secondary-select"
                            IconComponent={FilterListIcon}
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Tutor Categories */}
                      <FormControl variant="outlined" size="small" className="filter-dropdown">
                        <Select
                            value=""
                            displayEmpty
                            renderValue={() => "Tutor categories"}
                            className="secondary-select"
                            IconComponent={FilterListIcon}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                        >
                          {tutorCategoryOptions.map((category) => (
                              <MenuItem key={category} value={category} onClick={() => handleTutorCategoryChange(category)}>
                                <Box display="flex" alignItems="center" width="100%">
                                  <Checkbox checked={tutorCategories.includes(category)} />
                                  <Typography>{category}</Typography>
                                </Box>
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Active Filter Chips */}
                      <Box className="filter-chips flex flex-wrap gap-1 mt-2">
                        {specialties.map((specialty) => (
                            <Chip
                                key={specialty}
                                label={specialty}
                                onDelete={() => handleSpecialtyChange(specialty)}
                                size="small"
                                className="filter-chip"
                            />
                        ))}
                        {tutorCategories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                onDelete={() => handleTutorCategoryChange(category)}
                                size="small"
                                className="filter-chip"
                            />
                        ))}
                        {nativeSpeaker && (
                            <Chip
                                label="Native Speaker"
                                onDelete={handleNativeSpeakerChange}
                                size="small"
                                className="filter-chip"
                            />
                        )}
                        {selectedCountry !== "Any country" && (
                            <Chip
                                label={selectedCountry}
                                onDelete={() => setSelectedCountry("Any country")}
                                size="small"
                                className="filter-chip"
                            />
                        )}
                        {availability !== "Any time" && (
                            <Chip
                                label={availability}
                                onDelete={() => setAvailability("Any time")}
                                size="small"
                                className="filter-chip"
                            />
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box className="flex justify-end gap-2">
                      {/* Sort Dropdown */}
                      <FormControl variant="outlined" size="small" className="sort-dropdown">
                        <Select
                            value={sortOrder}
                            onChange={handleSortChange}
                            displayEmpty
                            className="secondary-select"
                            startAdornment={
                              <InputAdornment position="start">
                                <SortIcon fontSize="small" />
                              </InputAdornment>
                            }
                            renderValue={(value) => {
                              const labels = {
                                asc: "Sort by: Price (low to high)",
                                desc: "Sort by: Price (high to low)",
                                rating: "Sort by: Highest rating",
                                lessons: "Sort by: Most lessons"
                              };
                              return labels[value] || "Sort by";
                            }}
                        >
                          <MenuItem value="asc">Price: Low to High</MenuItem>
                          <MenuItem value="desc">Price: High to Low</MenuItem>
                          <MenuItem value="rating">Highest Rating</MenuItem>
                          <MenuItem value="lessons">Most Lessons</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Search Input */}
                      <TextField
                          placeholder="Search by name or keyword"
                          variant="outlined"
                          size="small"
                          value={searchTerm}
                          onChange={handleSearch}
                          className="search-input"
                          InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                            )
                          }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Mobile Filter Button */}
              <Box className="mobile-filter-button mb-4 md:hidden">
                <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    fullWidth
                    onClick={() => setMobileFiltersOpen(true)}
                    className="mobile-filter-btn"
                >
                  Filters & Sort
                </Button>
              </Box>

              {/* Mobile Filters Drawer */}
              <Drawer
                  anchor="bottom"
                  open={mobileFiltersOpen}
                  onClose={() => setMobileFiltersOpen(false)}
                  PaperProps={{
                    sx: {
                      maxHeight: '80vh',
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                      padding: '16px'
                    }
                  }}
              >
                <Box className="mobile-filters-container">
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6">Filters</Typography>
                    <IconButton onClick={() => setMobileFiltersOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Divider className="mb-4" />

                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    <LanguageIcon fontSize="small" className="mr-2" />
                    I want to learn
                  </Typography>
                  <FormControl fullWidth variant="outlined" className="mb-4">
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select language</em>
                      </MenuItem>
                      {languages.map((language) => (
                          <MenuItem key={language.languageId} value={language.languageId.toString()}>
                            {language.languageName}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    <AttachMoneyIcon fontSize="small" className="mr-2" />
                    Price per lesson
                  </Typography>
                  <Box sx={{ px: 2, mb: 4 }}>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={200}
                        sx={{ color: '#fe7aac' }}
                    />
                    <Box className="flex justify-between">
                      <Typography variant="body2">${priceRange[0]}</Typography>
                      <Typography variant="body2">${priceRange[1]}+</Typography>
                    </Box>
                  </Box>

                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    <PublicIcon fontSize="small" className="mr-2" />
                    Country of birth
                  </Typography>
                  <FormControl fullWidth variant="outlined" className="mb-4">
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                    >
                      <MenuItem value="Any country">Any country</MenuItem>
                      {isLoadingCountries ? (
                          <MenuItem disabled>Loading countries...</MenuItem>
                      ) : (
                          countries.map((country) => (
                              <MenuItem key={country} value={country}>
                                {country}
                              </MenuItem>
                          ))
                      )}
                    </Select>
                  </FormControl>

                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    <AccessTimeIcon fontSize="small" className="mr-2" />
                    Availability
                  </Typography>
                  <FormControl fullWidth variant="outlined" className="mb-4">
                    <Select
                        value={availability}
                        onChange={handleAvailabilityChange}
                    >
                      {availabilityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    <SortIcon fontSize="small" className="mr-2" />
                    Sort by
                  </Typography>
                  <FormControl fullWidth variant="outlined" className="mb-4">
                    <Select
                        value={sortOrder}
                        onChange={handleSortChange}
                    >
                      <MenuItem value="asc">Price: Low to High</MenuItem>
                      <MenuItem value="desc">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Highest Rating</MenuItem>
                      <MenuItem value="lessons">Most Lessons</MenuItem>
                    </Select>
                  </FormControl>

                  <Box className="flex justify-between mt-4">
                    <Button
                        variant="outlined"
                        onClick={clearFilters}
                        className="clear-filters-btn"
                    >
                      Clear all
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="apply-filters-btn"
                        sx={{ backgroundColor: '#fe7aac', color: 'black' }}
                    >
                      Apply filters
                    </Button>
                  </Box>
                </Box>
              </Drawer>

              {/* Filter Results Count */}
              {(specialties.length > 0 || tutorCategories.length > 0 || nativeSpeaker || selectedCountry !== "Any country" || availability !== "Any time" || searchTerm) && (
                  <Box className="filter-results-count mb-4">
                    <Typography variant="body2" color="text.secondary">
                      Showing {sortedInstructors.length} tutors based on your filters
                      <Button
                          variant="text"
                          size="small"
                          onClick={clearFilters}
                          sx={{ ml: 1, textTransform: 'none', color: '#fe7aac' }}
                      >
                        Clear all filters
                      </Button>
                    </Typography>
                  </Box>
              )}
            </Box>

            <Box className="findTutor-card mt-6" sx={{ display: "flex", position: "relative" }}>
              <Grid container spacing={2} sx={{ padding: "10px" }} onMouseLeave={() => setHoveredIndex(-1)}>
                {sortedInstructors.map((tutor, index) => (
                    <Grid
                        item
                        xs={8}
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          border: "solid 2px black",
                          marginBottom: "16px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                          }
                        }}
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          setSelectedIndex(index);
                        }}
                        ref={(el) => (cardRefs.current[index] = el)}
                        onClick={() => handleTutorCardClick(tutor.userName)}
                    >
                      <Card className="findTutor-cardContent" sx={{ boxShadow: "none", height: "100%" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={3} className="findTutor-CardImg">
                            <img
                                src={tutor.avatar}
                                alt={tutor.fullName}
                                style={{
                                  width: "100%",
                                  height: "180px",
                                  objectFit: "cover",
                                  borderRadius: "8px"
                                }}
                            />
                          </Grid>

                          <Grid item xs={5} className="findTutor-CardContent">
                            <Typography className="findTutor-Name" variant="h5" fontWeight="600">
                              {tutor.fullName}
                            </Typography>

                            <Box className="flex items-center mt-2">
                              <PublicIcon className="findTutor-icon text-gray-500" />
                              <Typography className="text-gray-600">
                                {tutor.country || tutor.address}
                              </Typography>
                            </Box>

                            <Box className="flex flex-wrap gap-4 mt-2">
                              <Box className="flex items-center">
                                <PersonIcon className="findTutor-icon text-gray-500" />
                                <Typography className="text-gray-600">
                                  {tutor.totalStudents} Active students
                                </Typography>
                              </Box>

                              <Box className="flex items-center">
                                <LocalLibraryIcon className="findTutor-icon text-gray-500" />
                                <Typography className="text-gray-600">
                                  {tutor.totalLessons} Lessons
                                </Typography>
                              </Box>
                            </Box>

                            <Box className="flex items-center mt-2">
                              <TranslateIcon className="findTutor-icon text-gray-500" />
                              <Typography className="text-gray-600">
                                {languages.find(lang => lang.languageId === tutor.languageId)?.languageName || `Language ID: ${tutor.languageId}`}
                              </Typography>
                            </Box>

                            <Box className="mt-3">
                              <Typography className="font-semibold">Experience:</Typography>
                              <Typography className="text-gray-700 line-clamp-2">
                                {tutor.teachingExperience}
                              </Typography>
                            </Box>

                            <Box className="mt-2">
                              <Typography className="font-semibold">Education:</Typography>
                              <Typography className="text-gray-700 line-clamp-2">
                                {tutor.education}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={4}>
                            <Box sx={{ textAlign: "center", padding: "20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <Box className="flex items-center">
                                    <StarIcon sx={{ color: "#FFD700" }} />
                                    <Typography variant="h6" fontWeight="bold">
                                      {tutor.averageRating.toFixed(1)}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {tutor.totalFeedbacks} reviews
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <Typography variant="h6" fontWeight="bold" className="findTutor-price">
                                    ${tutor.price}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    per hour
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <FavoriteIcon
                                      className="findTutor-icons mt-2"
                                      sx={{
                                        color: isFavorite(tutor.userName) ? "red" : "black",
                                        cursor: "pointer",
                                        fontSize: "28px",
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.2)"
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddFavorite(tutor.userName);
                                      }}
                                  />
                                </Box>
                              </Box>

                              <Box className="findTutor-btn mt-auto">
                                <Button
                                    className="findTutor-bookLesson"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                      backgroundColor: "#fe7aac",
                                      color: "black",
                                      fontWeight: "bold",
                                      border: "2px solid black",
                                      borderRadius: "8px",
                                      padding: "10px 0",
                                      marginBottom: "10px",
                                      "&:hover": {
                                        backgroundColor: "#ff9fc3"
                                      }
                                    }}
                                    onClick={(e) => handleBookLesson(tutor, e)}
                                >
                                  Book trial lesson
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    className="findTutor-sendMessage"
                                    onClick={(e) => handleSendMessage(tutor.userName, e)}
                                    sx={{
                                      border: "2px solid #dcdbe0",
                                      color: "black",
                                      fontWeight: "bold",
                                      borderRadius: "8px",
                                      padding: "10px 0",
                                      "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                        borderColor: "#c0c0c0"
                                      }
                                    }}
                                >
                                  Send message
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                ))}

                {(hoveredIndex >= 0 || selectedIndex !== null) && (
                    <Grid
                        item
                        xs={4}
                        className="findTutor-cardRight"
                        sx={{
                          position: "absolute",
                          top: `${
                              hoveredIndex !== -1 && cardRefs.current[hoveredIndex]
                                  ? cardRefs.current[hoveredIndex].offsetTop
                                  : selectedIndex !== null && cardRefs.current[selectedIndex]
                                      ? cardRefs.current[selectedIndex].offsetTop
                                      : 0
                          }px`,
                          right: 0,
                          transition: "top 0.3s ease, opacity 0.3s ease",
                          opacity: 1,
                          visibility: "visible",
                          marginTop: "-14px",
                          width: "100%"
                        }}
                    >
                      {sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex] ? (
                          <Card
                              className="findTutor-cardVideo"
                              sx={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                borderRadius: "12px",
                                overflow: "hidden"
                              }}
                          >
                            <img
                                style={{
                                  width: "100%",
                                  height: "300px",
                                  objectFit: "cover"
                                }}
                                src={(sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).avatar}
                                alt={(sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).fullName}
                            />

                            {(sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).lessons &&
                                (sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).lessons.$values &&
                                (sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).lessons.$values.length > 0 && (
                                    <Box className="p-3 bg-gray-100">
                                      <Typography variant="subtitle1" fontWeight="bold">Available Lessons:</Typography>
                                      <Box className="mt-2">
                                        {(sortedInstructors[hoveredIndex] || sortedInstructors[selectedIndex]).lessons.$values.slice(0, 2).map((lesson, idx) => (
                                            <Box key={idx} className="mb-2 p-2 bg-white rounded-lg shadow-sm">
                                              <Typography variant="body2" fontWeight="bold">{lesson.title}</Typography>
                                              <Typography variant="caption" color="text.secondary">
                                                Level: {lesson.level} • Status: {lesson.status}
                                              </Typography>
                                            </Box>
                                        ))}
                                      </Box>
                                    </Box>
                                )}
                          </Card>
                      ) : null}

                      <Button
                          className="findTutor-viewSchedule mt-3"
                          fullWidth
                          variant="outlined"
                          sx={{
                            border: "2px solid black",
                            color: "black",
                            fontWeight: "600",
                            borderRadius: "8px",
                            padding: "10px 0",
                            backgroundColor: "#f8f8f8",
                            "&:hover": {
                              backgroundColor: "#f0f0f0"
                            }
                          }}
                      >
                        View full schedule
                      </Button>
                    </Grid>
                )}
              </Grid>
            </Box>
          </Box>

          <Box className="flex justify-center mt-6 mb-8">
            <Pagination
                count={10}
                page={pageNumber}
                onChange={handlePageChange}
                color="secondary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "1rem",
                    minWidth: "40px",
                    height: "40px",
                  }
                }}
            /> </Box>
        </Box>

        {/* Booking Modal */}
        {selectedTutor && (
            <BookingModal
                open={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                tutorId={selectedTutor.userName}
                tutorName={selectedTutor.fullName}
                tutorAvatar={selectedTutor.avatar}
            />
        )}
      </>
  );
}