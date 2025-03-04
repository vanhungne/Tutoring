import { motion } from "framer-motion";
import StatCard from "../../../components/common/StatCard";
import { Package, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addLessonApi,
  deleteLessonApi,
  getLessonByTutorApi,
  updateLessonApi,
} from "../../../stores/slices/lessonSlice";
import toast from "react-hot-toast";

const schema = yup
  .object({
    level: yup.string().required("Level date is required"),
    title: yup.string().required("Title date is required"),
    description: yup.string().required("Description date is required"),
    duration: yup.number().required("Duration date is required"),
    learningObjectives: yup
      .string("Learning Objectives date is required")
      .required("Creation date is required"),
    createAt: yup
      .string()
      .required("Creation date is required")
      .test("notPastDate", "Date cannot be in the past", (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }),
    status: yup.string().required("Status date is required"),
    material: yup.string().required("Material date is required"),
    file: yup.mixed().test("required", "File is required", (value) => {
      return value && value.length > 0;
    }),
  })
  .required();

const TutorLesson = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteLesson = (id) => {
    setSelectedLessonId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedLessonId) {
      const resultAction = await dispatch(deleteLessonApi(selectedLessonId));

      if (deleteLessonApi.fulfilled.match(resultAction)) {
        toast.success("Lesson deleted successfully");
        dispatch(getLessonByTutorApi());
        setSelectedLessonId(null);
        setOpenDeleteModal(false);
      } else {
        toast.error("Error deleting lesson: " + resultAction.payload);
      }
    }
  };

  const cancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedLessonId(null);
  };

  const hanldeUpdateLesson = (lesson) => {
    setSelectedLessonId(lesson.lessonId);
    setValue("level", lesson.level);
    setValue("title", lesson.title);
    setValue("description", lesson.description);
    setValue("duration", lesson.duration);
    setValue("learningObjectives", lesson.learningObjectives);
    setValue("createAt", lesson.createAt);
    setValue("status", lesson.status);
    setValue("material", lesson.material);
    setValue("file", lesson.file);
    setOpen(true);
    setIsUpdateMode(true);
    handleClickOpen();
  };
  const dispatch = useDispatch();
  const { lessons, isLoading, error } = useSelector((state) => state.lessons);
  useEffect(() => {
    dispatch(getLessonByTutorApi());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("level", data.level);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
    formData.append("learningObjectives", data.learningObjectives);
    formData.append("createAt", data.createAt);
    formData.append("status", data.status);
    formData.append("material", data.material);

    for (let i = 0; i < data.file.length; i++) {
      formData.append("file", data.file[i]);
    }

    if (isUpdateMode) {
      const resultAction = await dispatch(
        updateLessonApi({ id: selectedLessonId, data: formData })
      );
      if (updateLessonApi.fulfilled.match(resultAction)) {
        toast.success("Lesson updated successfully");
      } else {
        toast.error("Error updating lesson: " + resultAction.payload);
      }
    } else {
      const resultAction = await dispatch(addLessonApi(formData));
      if (addLessonApi.fulfilled.match(resultAction)) {
        toast.success("Lesson added successfully");
      } else {
        toast.error("Error adding lesson: " + resultAction.payload);
      }
    }

    dispatch(getLessonByTutorApi());
    reset();
    setIsUpdateMode(false);
    setOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 flex d-flex "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Lessons"
            icon={Package}
            value={lessons.length}
            color="#6366F1"
          />
        </motion.div>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ marginLeft: "87%" }}
        >
          Add lesson
        </Button>

        {/* Modal Add */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            className="text-center font-bold text-3xl"
          >
            {"Add new lesson"}
          </DialogTitle>
          <DialogContent sx={{ width: "600px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth margin="normal" error={!!errors.level}>
                <InputLabel>Level</InputLabel>
                <Select
                  {...register("level")}
                  onChange={(e) => setValue("level", e.target.value)}
                  FormHelperTextProps={{ sx: { minHeight: "20px" } }}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Title"
                {...register("title")}
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />
              <TextField
                label="Duration (in days)"
                {...register("duration")}
                fullWidth
                margin="normal"
                type="number"
                error={!!errors.duration}
                helperText={errors.duration?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />
              <TextField
                label="Learning Objectives"
                {...register("learningObjectives")}
                fullWidth
                margin="normal"
                error={!!errors.learningObjectives}
                helperText={errors.learningObjectives?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />
              <TextField
                {...register("createAt")}
                fullWidth
                margin="normal"
                type="datetime-local"
                error={!!errors.createAt}
                helperText={errors.createAt?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />

              <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  {...register("status")}
                  onChange={(e) => setValue("status", e.target.value)}
                  FormHelperTextProps={{ sx: { minHeight: "20px" } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Material"
                {...register("material")}
                fullWidth
                margin="normal"
                error={!!errors.material}
                helperText={errors.material?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />
              <TextField
                label="Description"
                {...register("description")}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                FormHelperTextProps={{ sx: { minHeight: "20px" } }}
              />
              <input
                type="file"
                onChange={(e) => {
                  setValue("file", e.target.files);
                }}
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  width: "100%",
                }}
              />
              {errors.file && (
                <Typography color="error">{errors.file.message}</Typography>
              )}

              <DialogActions>
                <Button
                  type="submit"
                  onClick={handleClose}
                  sx={{
                    width: "100px",
                    backgroundColor: "yellow",
                    color: "black",
                  }}
                >
                  Disagree
                </Button>
                <Button
                  type="submit"
                  autoFocus
                  sx={{
                    width: "100px",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Agree
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal delete */}
        <Modal open={openDeleteModal} onClose={cancelDelete}>
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" className="text-center">
              Do You Want To Delete This Lesson?
            </Typography>
            <Box className="flex justify-between mt-4">
              <Button variant="outlined" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Table content */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Image</TableCell>
              <TableCell style={{ color: "white" }}>Title</TableCell>
              <TableCell style={{ color: "white" }}>Duration</TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell style={{ color: "white" }}>
                  <img
                    style={{
                      width: "190px",
                      height: "130px",
                      objectFit: "cover",
                    }}
                    src={lesson.imageUrl}
                  />
                </TableCell>

                <TableCell style={{ color: "white" }}>{lesson.title}</TableCell>
                <TableCell style={{ color: "white" }}>
                  {lesson.duration} minute
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  {lesson.status === "Active" ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                      {lesson.status}
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                      {lesson.status}
                    </span>
                  )}
                </TableCell>
                <TableCell
                  className="flex space-x-2"
                  style={{ color: "white" }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    sx={{ color: "yellow" }}
                    onClick={() => hanldeUpdateLesson(lesson)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    sx={{ color: "red" }}
                    onClick={() => handleDeleteLesson(lesson.lessonId)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};
export default TutorLesson;
