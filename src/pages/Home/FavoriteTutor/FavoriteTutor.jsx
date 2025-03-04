import { Box, Card, Grid, Typography, Button, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useRef } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import TranslateIcon from "@mui/icons-material/Translate";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFavoriteApi,
  getFavoriteApi,
} from "../../../stores/slices/favoriteSlice";

export default function FavoriteTutor() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const cardRefs = useRef([]);
  const [pageNumber, setPageNumber] = useState(1);

  const isFavorite = (tutorName) =>
    favoriteInstructor.some((tutor) => tutor.tutor === tutorName);

  const dispatch = useDispatch();
  const {
    favoriteInstructor = [],
    isLoading,
    error,
  } = useSelector((state) => state.favorite);

  useEffect(() => {
    dispatch(getFavoriteApi({ pageNumber }));
  }, [dispatch, pageNumber]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  // delete favorite
  const handleRemoveFavorite = async (tutorName) => {
    console.log("Removing tutor:", tutorName);
    if (tutorName) {
      await dispatch(deleteFavoriteApi(tutorName));
      dispatch(getFavoriteApi({ pageNumber }));
    } else {
      console.error("Invalid tutor name");
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography> Quay ve Home</Typography>;

  return (
    <>
      {" "}
      <Box className="findTutor" onClick={() => setSelectedIndex(null)}>
        <Box className="findTutor-content">
          <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
            {favoriteInstructor?.length || 0} saved English tutors
          </Typography>
          <Box
            className="findTutor-card mt-10"
            sx={{ display: "flex", position: "relative" }}
          >
            <Grid
              container
              spacing={2}
              sx={{ padding: "10px" }}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              {favoriteInstructor?.length > 0 &&
                favoriteInstructor.map((tutor, index) => (
                  <Grid
                    item
                    xs={8}
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "solid 2px black",
                      marginBottom: "16px",
                    }}
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setSelectedIndex(index);
                    }}
                    ref={(el) => (cardRefs.current[index] = el)}
                  >
                    <Card
                      className="findTutor-cardContent"
                      sx={{ boxShadow: "none" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={3} className="findTutor-CardImg">
                          <img src={tutor.avatar} alt="img" />
                        </Grid>
                        <Grid item xs={5} className="findTutor-CardContent">
                          <Typography className="findTutor-Name">
                            {tutor.fullName}
                          </Typography>
                          <span className="findTutor-country">
                            <PublicIcon className="findTutor-icon" />
                            {tutor.country}
                          </span>
                          <Box className="flex d-flex ">
                            <Typography className="findTutor-students">
                              <PersonIcon className="findTutor-icon" />
                              10 Active students
                            </Typography>
                            <Typography
                              className="findTutor-lessons"
                              sx={{ marginLeft: "10px" }}
                            >
                              <LocalLibraryIcon className="findTutor-icon" />
                              {tutor.lessons} Lessons
                            </Typography>
                          </Box>
                          <Typography className="findTutor-languages">
                            <TranslateIcon className="findTutor-icon" />
                            {tutor.education}
                          </Typography>
                          <Box className="findTutor-cardDes">
                            <Typography className="findTutor-description">
                              {tutor.teachingExperience}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4} >
                          <Box sx={{ textAlign: "center", padding: "20px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  className="findTutor-star"
                                >
                                  ★ 5 {tutor.rate}
                                </Typography>
                                <Typography sx={{ marginTop: "5px" }}>
                                  {tutor.review}21 review
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  className="findTutor-price"
                                  variant="h6"
                                >
                                  £ {tutor.price}
                                </Typography>
                                <Typography sx={{ marginTop: "5px" }}>
                                  {tutor.minute}40-min lesson
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <FavoriteIcon
                                  className="findTutor-icons mt-2"
                                  onClick={() =>
                                    handleRemoveFavorite(tutor.userName)
                                  }
                                  sx={{
                                    color: isFavorite(tutor.userName)
                                      ? "red"
                                      : "black",
                                    cursor: "pointer",
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box className="findTutor-btn">
                              <Button
                                className="findTutor-bookLesson"
                                variant="contained"
                                fullWidth
                              >
                                Book trial lesson
                              </Button>
                              <Button
                                variant="outlined"
                                fullWidth
                                className="findTutor-sendMessage"
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
                        : selectedIndex !== null &&
                          cardRefs.current[selectedIndex]
                        ? cardRefs.current[selectedIndex].offsetTop
                        : 0
                    }px`,
                    right: 0,
                    transition: "top 0.3s ease, opacity 0.3s ease",
                    opacity: 1,
                    visibility: "visible",
                    marginTop: "-14px",
                    width:"100%"
                  }}
                >
                  {favoriteInstructor[hoveredIndex] ||
                  favoriteInstructor[selectedIndex] ? (
                    <Card
                      className="findTutor-cardVideo"
                      sx={{ boxShadow: "none" }}
                    >
                      <img
                        style={{ width: "100%", objectFit: "cover" }}
                        src={
                          (
                            favoriteInstructor[hoveredIndex] ||
                            favoriteInstructor[selectedIndex]
                          ).avatar
                        }
                        alt="img"
                      />
                    </Card>
                  ) : null}
                  <Button className="findTutor-viewSchedule mt-5" fullWidth>
                    View full schedule
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
        <Pagination
          className="pagination"
          count={10}
          page={pageNumber}
          onChange={handlePageChange}
          color="secondary"
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: "1.5rem",
              padding: "12px",
              minWidth: "48px",
              minHeight: "48px",
            },
            "& .MuiPaginationItem-ellipsis": {
              fontSize: "2rem",
            },
          }}
        />
      </Box>
    </>
  );
}
