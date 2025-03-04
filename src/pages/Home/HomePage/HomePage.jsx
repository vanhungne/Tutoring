import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import "./HomePage.css";
import CountUp from "react-countup";
import img1 from "../../../assets/image/hero2024.main.143d9896.avif";
import img2 from "../../../assets/image/hero2024.subpic.21d3541b.avif";
import img3 from "../../../assets/image/New-York-Times-Logo8x6_0.png";
import img4 from "../../../assets/image/Bbc.png";
import img5 from "../../../assets/image/Bloomberg.png";
import img6 from "../../../assets/image/FastCompany.png";
import img7 from "../../../assets/image/Forbes.png";
import img8 from "../../../assets/image/theGuardian.png";
import img9 from "../../../assets/image/find_tutor.507e3817.avif";
import img10 from "../../../assets/image/meet_your_tutor.9a5e8ba1.avif";
import img11 from "../../../assets/image/commit_to_learning.27ea7b73.avif";
import img12 from "../../../assets/image/b.06aa5c98.avif";
import img13 from "../../../assets/image/a.c6c5f18c.avif";
import img14 from "../../../assets/image/tutor.e2a2c1ac.avif";
import img15 from "../../../assets/image/Suitcase.b014ed7d.webp";

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MessageIcon from "@mui/icons-material/Message";
import StarIcon from "@mui/icons-material/Star";
import ComputerIcon from "@mui/icons-material/Computer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const topTutors = [
  { title: "English tutors", count: 32151 },
  { title: "Spanish tutors", count: 9788 },
  { title: "French tutors", count: 3651 },
  { title: "German tutors", count: 1502 },
  { title: "Italian tutors", count: 2443 },
  { title: "Chinese tutors", count: 4956 },
  { title: "Arabic tutors", count: 3595 },
  { title: "Japanese tutors", count: 2768 },
  { title: "Portuguese tutors", count: 1560 },
];

const moreTutors = [
  { title: "Polish tutors", count: 354 },
  { title: "Dutch tutors", count: 226 },
  { title: "Greek tutors", count: 343 },
  { title: "Serbian tutors", count: 145 },
  { title: "Ukrainian tutors", count: 222 },
  { title: "Czech tutors", count: 53 },
  { title: "Swedish tutors", count: 95 },
  { title: "Indonesian tutors", count: 1012 },
  { title: "Korean tutors", count: 1245 },
  { title: "Danish tutors", count: 40 },
  { title: "Urdu tutors", count: 487 },
  { title: "Hebrew tutors", count: 164 },
  { title: "Turkish tutors", count: 738 },
  { title: "Hindi tutors", count: 383 },
  { title: "Norwegian tutors", count: 52 },
];

const features = [
  {
    title: "Flexible scheduling",
    description:
      "Easily book single or weekly lessons. Cancel or reschedule if your plans change.",
    icon: <CalendarMonthIcon fontSize="large" />,
  },
  {
    title: "Online classroom",
    description:
      "Meet your tutor in our all-in-one video platform, available on both web and app.",
    icon: <ComputerIcon fontSize="large" />,
  },
  {
    title: "Speaking timer",
    description: "Track how much you've spoken in each lesson.",
    icon: <AccessTimeIcon fontSize="large" />,
  },
];

const features1 = [
  {
    title: "TalkNow",
    description:
      "Practice speaking and receive feedback anytime with our AI-powered conversation coach.",
    icon: <CalendarMonthIcon fontSize="large" />,
  },
  {
    title: "Vocabulary flashcards",
    description:
      "Try fun exercises to practice words from your lessons or create custom flashcards.",
    icon: <ComputerIcon fontSize="large" />,
  },
  {
    title: "Courses and quizzes",
    description:
      "Explore a variety of materials for any topic and level, available anytime in your profile.",
    icon: <AccessTimeIcon fontSize="large" />,
  },
];

const faqData = [
  {
    question: "How does Preply choose tutors?",
    answer:
      "Preply chooses tutors based on their qualifications and experience.",
  },
  {
    question: "How do I choose the right tutor for me?",
    answer:
      "You can choose a tutor based on their rating, reviews, and teaching style.",
  },
  {
    question: "Can I switch my tutor?",
    answer:
      "Yes, you can switch tutors at any time through your account settings.",
  },
  {
    question: "How do I join the class?",
    answer:
      "You will receive a link to join the class after booking a session.",
  },
  {
    question: "What happens if I miss a class?",
    answer:
      "If you miss a class, you can reschedule it based on the tutor's availability.",
  },
];

const categories = [
  {
    title: "Popular online language courses",
    items: [
      "Online English classes",
      "Online Spanish classes",
      "Online German classes",
      "Online French classes",
      "Online Business English courses",
    ],
  },
  {
    title: "Learn a language online",
    items: [
      "Learn English online",
      "Learn Spanish online",
      "Learn French online",
      "Learn Japanese online",
      "Learn German online",
    ],
  },
  {
    title: "Tutors for different learning needs",
    items: [
      "English classes for kids",
      "IELTS tutors",
      "Native English speakers online",
      "Online English courses for adults",
      "Spanish tutors for high school students",
      "Online Spanish courses for adults",
    ],
  },
  {
    title: "Other popular courses",
    items: [
      "English conversational classes",
      "English classes for Spanish speakers",
      "Business English lessons",
      "Canadian English tutors",
      "Intensive Spanish classes",
    ],
  },
];

const moreCategories = [
  {
    title: "Advanced Learning",
    items: [
      "Professional English courses",
      "Legal English classes",
      "Advanced Spanish training",
    ],
  },
  {
    title: "Language Certifications",
    items: [
      "TOEFL preparation",
      "DELE exam training",
      "Cambridge English certification",
    ],
  },
];

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const handleBecomeTutorClick = () => {
    navigate("/applyTutor");
  };

  return (
    <>
      {/* banner */}
      <Box className="homepage">
        <section className="banner">
          <Box className="homepage-container">
            <Box className="">
              <Grid container spacing={2} className="banner-content">
                <Grid item xs={6} className="banner-left">
                  <Box className="banner-title">
                    <Typography sx={{ fontSize: "45px", fontWeight: "600" }}>
                      Learn faster with the best <br />
                      1-on-1 language <br /> tutor for you.
                    </Typography>
                    <Typography sx={{ fontSize: "20px" }}>
                      Take online lessons tailored to your level, budget and
                      schedule.
                    </Typography>
                    <Button className="banner-btn">Find your tutor</Button>
                    <Box className="flex gap-10 text-center">
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          <CountUp
                            start={0}
                            end={50000}
                            duration={2}
                            separator=","
                          />
                          +
                        </Typography>
                        <Typography variant="body1" color="gray">
                          Expert tutors
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          <CountUp start={0} end={180} duration={2} />+
                        </Typography>
                        <Typography variant="body1" color="gray">
                          Subjects
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          <CountUp start={0} end={25} duration={2} />
                          min
                        </Typography>
                        <Typography variant="body1" color="gray">
                          Trial lessons
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} className="banner-right">
                  <Box className="banner-img">
                    <Box className="main-image-container">
                      <img src={img1} alt="Main user" className="main-image" />

                      <span className="chat-bubble main-bubble">
                        ¡Buenos días!
                      </span>

                      <Box className="icon-container">
                        <Box className="icon">💬</Box>
                        <Box className="icon">🔄</Box>
                        <Box className="icon active">⬤</Box>
                      </Box>
                    </Box>

                    <Box className="small-image-container">
                      <img
                        src={img2}
                        alt="Small user"
                        className="small-image"
                      />

                      <span className="chat-bubble small-bubble">Hello!</span>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Learning journey */}
          </Box>
        </section>

        {/* learning */}
        <section className="leaning-journey">
          <Box className="homepage-container">
            <Box className="  ">
              <Typography className="leaning-title">
                Start your learning journey on Preply, <br />
                trusted globally for over 10 years
              </Typography>
              <Box className="learning-activity">
                <Grid container spacing={2} className="learning-content">
                  <Grid item xs={4} className="flex d-flex">
                    <Box className="learning-icons">
                      <ElectricBoltIcon
                        sx={{ marginLeft: "15px", fontSize: "20px" }}
                      />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: "600", fontSize: "20px" }}>
                        The most effective way to learn
                      </Typography>
                      <Typography sx={{ fontSize: "15px" }}>
                        Take 1-on-1 personalized lessons <br /> tailored to your
                        goals
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} className="flex d-flex">
                    <Box className="learning-icons">
                      <CalendarMonthIcon
                        sx={{ marginLeft: "15px", fontSize: "20px" }}
                      />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: "600", fontSize: "20px" }}>
                        Learning that fits your life
                      </Typography>
                      <Typography sx={{ fontSize: "15px" }}>
                        Schedule on-the-go with our app and <br /> use our
                        self-study resources
                      </Typography>
                    </Box>
                  </Grid>{" "}
                  <Grid item xs={4} className="flex d-flex">
                    <Box className="learning-icons">
                      <MessageIcon
                        sx={{ marginLeft: "15px", fontSize: "20px" }}
                      />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: "600", fontSize: "20px" }}>
                        Skills for the real world
                      </Typography>
                      <Typography sx={{ fontSize: "15px" }}>
                        Learn to speak confidently with the <br />
                        best tutor for you
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </section>

        {/* language tutor */}

        <section className="language-tutor">
          <Box className="homepage-container">
            <Box className="">
              <Grid container spacing={2}>
                {topTutors.map((tutor, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" className="language-less">
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {tutor.title}
                        </Typography>
                        <Typography color="textSecondary">
                          {tutor.count} teachers
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Button
                sx={{
                  mt: 3,
                  color: "black",
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                  marginLeft: "45%",
                }}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show less" : "Show more"}
              </Button>

              {showMore && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {moreTutors.map((tutor, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined" className="language-more">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {tutor.title}
                          </Typography>
                          <Typography color="textSecondary">
                            {tutor.count} teachers
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </section>

        {/* number */}
        <section className="number">
          <Box className="homepage-container">
            <Box className="">
              <Grid container spacing={2}>
                <Grid item xs={4} className="number-grid">
                  <Box className="number-content">
                    <Typography className="number-title">
                      <CountUp start={0} end={5} duration={2} separator="," />{" "}
                      <StarIcon sx={{ fontSize: "70px" }} />
                    </Typography>
                    <Typography className="number-text">
                      On the App Store, over 26K reviews
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} className="number-grid">
                  <Box className="number-content">
                    <Typography className="number-title">
                      {" "}
                      <CountUp start={0} end={2} duration={2} />M
                    </Typography>
                    <Typography className="number-text">
                      Learners worldwide
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box className="number-content">
                    <Typography className="number-title">
                      <CountUp start={0} end={50} duration={2} />M
                    </Typography>
                    <Typography className="number-text">
                      Lessons taken on Preply
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </section>

        {/* pressSection */}
        <section className="pressSection">
          <Box className="homepage-container">
            <Box className="">
              <Typography className="press-title">
                Preply in the press
              </Typography>
              <Box className="mt-5 ml-16">
                <Grid container spacing={2} className="press-grid ">
                  <Grid xs={2}>
                    <img src={img3} className="press-image" />
                  </Grid>
                  <Grid xs={2}>
                    <img src={img4} className="press-image" />
                  </Grid>
                  <Grid xs={2}>
                    <img
                      src={img5}
                      className="press-image"
                      style={{ height: "35px" }}
                    />
                  </Grid>
                  <Grid xs={2}>
                    <img
                      src={img6}
                      className="press-image"
                      style={{ height: "35px" }}
                    />
                  </Grid>
                  <Grid xs={2}>
                    <img src={img7} className="press-image" />
                  </Grid>
                  <Grid xs={2}>
                    <img
                      src={img8}
                      className="press-image"
                      style={{ height: "35px" }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="pess-bottom"></Box>
            </Box>
          </Box>
        </section>

        {/* preplyWork */}
        <section className="preplyWork">
          <Box className="homepage-container">
            <Box className="">
              <Typography className="preply-title">How Preply works</Typography>
              <Box className="preply-content">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box className="preply-step mt-4">
                      <Typography>Step 1</Typography>
                    </Box>
                    <Box className=" mt-4">
                      <img src={img9} className="preply-image" />
                    </Box>
                    <Box className="preply-footer mt-4">
                      <Typography sx={{ fontWeight: "600", fontSize: "30px" }}>
                        Find a tutor for 1:1 online tutoring
                      </Typography>
                      <Typography sx={{ fontSize: "18px" }}>
                        Tell us what you are looking for and we will match you
                        with your perfect tutor.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="preply-step mt-4">
                      <Typography>Step 2</Typography>
                    </Box>
                    <Box className=" mt-4">
                      <img src={img10} className="preply-image" />
                    </Box>
                    <Box className="preply-footer mt-4">
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: "30px",
                          marginBottom: "45px",
                        }}
                      >
                        Take a trial lesson
                      </Typography>
                      <Typography sx={{ fontSize: "18px" }}>
                        Connect with your tutor in a 25 or 50 min trial. Try
                        another tutor for free if you are not 100% satisfied.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="preply-step mt-4">
                      <Typography>Step 3</Typography>
                    </Box>
                    <Box className=" mt-4">
                      <img src={img11} className="preply-image" />
                    </Box>
                    <Box className="preply-footer mt-4">
                      <Typography sx={{ fontWeight: "600", fontSize: "30px" }}>
                        Book lessons that fit your schedule
                      </Typography>
                      <Typography sx={{ fontSize: "18px" }}>
                        Choose the number of lessons you want to take each week
                        and start seeing your skills improve. Change tutors,
                        pause or cancel anytime.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </section>

        {/* effective */}
        <section className="effective">
          <Box className="homepage-container">
            <Box>
              <Typography className="effcetive-title">
                The most effective way to learn
              </Typography>
              <Box>
                <Typography
                  sx={{
                    fontSize: "25px",
                    fontWeight: 600,
                    marginBottom: "20px",
                  }}
                >
                  Tools for 1-on-1 lessons
                </Typography>
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card className="effective-card">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {feature.title}
                          </Typography>
                          <Typography variant="body2">
                            {feature.description}
                          </Typography>
                          <Box mt={2}>{feature.icon}</Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="effective-card-img">
                      <img src={img12} alt="Tutor" className="effective-img" />
                      <Button variant="contained" className="effective-btn">
                        Hi there!
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "25px",
                    fontWeight: 600,
                    marginBottom: "20px",
                    marginTop: "20px",
                  }}
                >
                  Tools for self-study
                </Typography>
                <Grid container spacing={2}>
                  {features1.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card className="effective-card1">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {feature.title}
                          </Typography>
                          <Typography variant="body2">
                            {feature.description}
                          </Typography>
                          <Box mt={2}>{feature.icon}</Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="effective-card-img">
                      <img src={img13} alt="Tutor" className="effective-img" />
                      <Button variant="contained" className="effective-btn1">
                        Great!
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </section>

        {/* lessons */}
        <section className="lessons">
          <Box className="homepage-container">
            <img
              src="https://cdn-icons-png.freepik.com/512/4047/4047169.png"
              alt="Icon"
              className="lessons-icon"
            />
            <Typography className="lessons-title">
              Lessons you will love.Guaranteed.
            </Typography>
            <Typography className="lessons-text ">
              Try another tutor for free if you are not satisfied.
            </Typography>
          </Box>
        </section>

        {/* becomeTutor */}
        <section className="becomeTutor">
          <Box
            className="homepage-container"
            sx={{ padding: "40px", display: "flex", justifyContent: "center" }}
          >
            <Grid container spacing={2} className="become-container">
              <Grid item xs={12} md={5} className="become-left">
                <img src={img14} alt="Tutor" className="become-image" />
              </Grid>
              <Grid className="become-right" item xs={12} md={5}>
                <Typography className="become-title">Become a tutor</Typography>
                <Typography className="become-text">
                  Earn money sharing your expert knowledge with students. Sign
                  up to start tutoring online with Preply.
                </Typography>
                <Box className="become-activity">
                  <Button
                    variant="contained"
                    fullWidth
                    className="become-activity-btn"
                  >
                    <SearchIcon sx={{ marginRight: "10px" }} /> Find new
                    students
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    className="become-activity-btn"
                  >
                    <TrendingUpIcon sx={{ marginRight: "10px" }} /> Grow your
                    business
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    className="become-activity-btn"
                  >
                    <LockOpenIcon sx={{ marginRight: "10px" }} /> Get paid
                    securely
                  </Button>
                </Box>
                <Button onClick={handleBecomeTutorClick} className="become-btn">
                  Become a tutor
                </Button>
                <Box sx={{ marginTop: "20px" }}>
                  <Link
                    to=""
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    How it works
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </section>

        {/* corporate */}
        <section className="corporate">
          <Box className="homepage-container">
            <Box className="corporate-container">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box className="corporate-left">
                    <Typography className="corporate-title">
                      Corporate language training for business
                    </Typography>
                    <Typography className="corporate-text">
                      Preply corporate training is designed for teams and
                      businesses offering personalized language learning with
                      online tutors. Book a demo to learn more.
                    </Typography>
                    <Typography className="corporate-text">
                      Do you want your employer to pay for your lessons? Refer
                      your company now!
                    </Typography>

                    <Button fullWidth className="corporate-btn">
                      Book your demo
                    </Button>
                    <Button fullWidth className="corporate-btn-refer">
                      Refer your company
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="corporate-right">
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={4}>
                        <Box position="relative" textAlign="center">
                          <img
                            src={img15}
                            alt="Valise"
                            className="corporate-image"
                          />
                          <Typography
                            className="corporate-right-text"
                            position="absolute"
                            top="45%"
                            left="15%"
                          >
                            Valise
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box position="relative" textAlign="center">
                          <img
                            src={img15}
                            alt="Maleta"
                            style={{
                              width: "100%",
                              height: "410px",
                              objectFit: "contain",
                            }}
                          />
                          <Typography
                            position="absolute"
                            top="35%"
                            left="15%"
                            className="corporate-right-text"
                          >
                            Maleta
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box position="relative" textAlign="center">
                          <img
                            src={img15}
                            alt="Suitcase"
                            style={{
                              width: "100%",
                              height: "410px",
                              objectFit: "contain",
                            }}
                          />
                          <Typography
                            position="absolute"
                            top="25%"
                            left="15%"
                            className="corporate-right-text"
                          >
                            Suitcase
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </section>

        {/* question */}
        <section className="question">
          <Box className="homepage-container">
            <Box className="question-container">
              <Grid container spacing={0}>
                <Grid item xs={5}>
                  <Typography sx={{ fontWeight: "bold", fontSize: "50px" }}>
                    Frequently asked questions
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  {faqData.map((item, index) => (
                    <Accordion key={index} sx={{ boxShadow: "none" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.question}
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{item.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  <Button
                    variant="body1"
                    sx={{
                      marginTop: "20px",
                      fontWeight: "bold",
                      color: "#fe7aac",
                      textDecoration: "underline",
                    }}
                  >
                    Read all FAQ
                  </Button>
                </Grid>
              </Grid>
              <Box className="question-footer"></Box>
            </Box>
          </Box>
        </section>

        {/* listActivity */}
        <section className="listActivity">
          <Box className="homepage-container">
            <Box className="listActivity-container">
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                Online tutoring & Language lessons and classes
              </Typography>
              <Grid container spacing={4}>
                {categories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Typography variant="h6" fontWeight="bold">
                      {category.title}
                    </Typography>
                    <MenuList>
                      {category.items.map((item, idx) => (
                        <MenuItem
                          key={idx}
                          sx={{ "&:hover": { backgroundColor: "transparent" } }}
                          className="listActivity-items"
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Grid>
                ))}
              </Grid>
              <Box className="flex  mt-6 mb-6">
                <Button
                  sx={{
                    mt: 3,
                    color: "black",
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                    marginLeft: "45%",
                  }}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less" : "Show more"}
                </Button>
              </Box>
              {showMore && (
                <Grid container spacing={4} className="mt-6">
                  {moreCategories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Typography variant="h6" fontWeight="bold">
                        {category.title}
                      </Typography>
                      <MenuList>
                        {category.items.map((item, idx) => (
                          <MenuItem
                            key={idx}
                            sx={{
                              "&:hover": { backgroundColor: "transparent" },
                            }}
                            className="listActivity-items"
                          >
                            {item}{" "}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </section>

        <Button className="btn-homepage" onClick={() => navigate("/findTutor")}>
          Find your tutoradas
        </Button>
      </Box>
    </>
  );
}
