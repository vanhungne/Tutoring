import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addScheduleApi,
  deleteScheduleApi,
  getScheduleByUsernameApi,
  updateScheduleApi,
} from "../../../stores/slices/scheduleSlice";
import useUserName from "../../../hooks/useUserName"; 

const schema = yup
  .object({
    startTime: yup.string().required(),
    status: yup.string().required(),
  })
  .required();

export default function Calendar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const userName = useUserName()
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    document.activeElement?.blur();
    setOpen(false);
  };
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1));
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { schedule, isLoading, error } = useSelector((state) => state.schedule);

  useEffect(() => {
    if (userName) {
      dispatch(getScheduleByUsernameApi(userName));
    }
  }, [dispatch, userName]);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    days.push({ date: day, isCurrentMonth: true });
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      startTime: "",
      status: "",
    },
  });

  const handleUpdateSchedule = (schedule) => {
    setSelectedScheduleId(schedule.tutorAvailabilityId);
    setValue("startTime", schedule.startTime);
    setValue("status", schedule.status);
    setIsUpdateMode(true);
    handleOpen();
  };

  const onSubmit = async (data) => {
    try {
      if (isUpdateMode) {
        await dispatch(updateScheduleApi({ id: selectedScheduleId, data })).unwrap();
        toast.success("Cập nhật lịch thành công");
      } else {
        await dispatch(addScheduleApi(data)).unwrap();
        toast.success("Thêm lịch thành công");
      }
      dispatch(getScheduleByUsernameApi(userName)); 
      handleClose();
    } catch (error) {
      toast.error(isUpdateMode ? "Cập nhật lịch thất bại." : "Thêm lịch thất bại.");
    }
  };
  const handleDeleteSchedule = (id) => {
    setSelectedScheduleId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedScheduleId) {
      dispatch(deleteScheduleApi(selectedScheduleId));
      setOpenDeleteModal(false);
      setSelectedScheduleId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedScheduleId(null);
  };

  if (isLoading) {
    return <Box className="text-center p-4">Đang tải...</Box>;
  }

  if (error && error.status === 400) {
    return (
      <Box className="text-center p-4">
        <Typography className="text-red-500">
          Không có lịch trình nào.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Thêm lịch")}
          startIcon={<Plus />}
        >
          Thêm lịch
        </Button>
      </Box>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <Box className="text-center p-4">
        <Typography>Không có lịch trình nào.</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<Plus />}
        >
          Add Schedule
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" className="text-center">
              {isUpdateMode ? "Cập nhật lịch trình" : "Thêm lịch trình"}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={2}>
                <TextField
                  name="startTime"
                  label="Start Time"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 60 }}
                  {...register("startTime")}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  select
                  name="status"
                  label="Status"
                  fullWidth
                  {...register("status")}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Unavailable">Unavailable</MenuItem>
                </TextField>
              </Box>
              <Button type="submit" variant="contained" fullWidth>
                {isUpdateMode ? "Cập nhật lịch" : "Thêm lịch"}
              </Button>
            </form>
          </Box>
        </Modal>
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-7xl mx-auto p-4 bg-gray-900 text-gray-100 rounded-lg">
      <Box className="flex items-center justify-between mb-4">
        <Typography className="text-xl font-semibold">
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
        <Box className="flex items-center gap-2">
          <Button
            variant="outlined"
            onClick={previousMonth}
            className="h-8 w-8 border-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outlined"
            onClick={nextMonth}
            className="h-8 w-8 border-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600"
            onClick={handleOpen}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Schedule
          </Button>
        </Box>
      </Box>

      <Box className="grid grid-cols-7 gap-px bg-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box
            key={day}
            className="p-2 text-center text-sm font-medium bg-gray-900"
          >
            {day}
          </Box>
        ))}
      </Box>

      <Box className="grid grid-cols-7 gap-px bg-gray-700">
        {days.map(({ date, isCurrentMonth }, index) => {
          if (!date) {
            console.error("Date is undefined for index:", index);
            return null; // Skip rendering if date is undefined
          }

          const daySchedules = schedule.filter((schedule) => {
            const scheduleDate = new Date(schedule.startTime);
            return (
              scheduleDate.getFullYear() === date.getFullYear() &&
              scheduleDate.getMonth() === date.getMonth() &&
              scheduleDate.getDate() === date.getDate()
            );
          });

          return (
            <Box
              key={index}
              className={`min-h-[120px] p-2 bg-gray-900 ${
                isCurrentMonth ? "text-gray-100" : "text-gray-500"
              }`}
            >
              <span className="text-sm">{date.getDate()}</span>
              <Box className="mt-1 space-y-1">
                {daySchedules.map((schedule) => (
                  <Box key={schedule.tutorAvailabilityId} className="relative">
                    <Box
                      className={`text-xs p-1 rounded truncate ${
                        schedule.status === "Available"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      onClick={() =>
                        handleDeleteSchedule(schedule.tutorAvailabilityId)
                      }
                    >
                      {new Date(schedule.startTime).toLocaleString()} -{" "}
                      <Typography className="text-xs">
                        Id: {schedule.tutorAvailabilityId}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleDeleteSchedule(schedule.tutorAvailabilityId)
                      }
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdateSchedule(schedule)}
                    >
                      Update
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" className="text-center">
            {isUpdateMode ? "Cập nhật lịch trình" : "Thêm lịch trình"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                name="startTime"
                label="Start Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 60 }}
                {...register("startTime")}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            </Box>
            <Box mb={2}>
              <TextField
                select
                name="status"
                label="Status"
                fullWidth
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </TextField>
            </Box>
            <Button type="submit" variant="contained" fullWidth>
              {isUpdateMode ? "Cập nhật lịch" : "Thêm lịch"}
            </Button>
          </form>
        </Box>
      </Modal>

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
            Do You Want To Delete This Schedule?
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
    </Box>
  );
}
