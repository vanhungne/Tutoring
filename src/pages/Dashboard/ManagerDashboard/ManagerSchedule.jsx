import { Box, Button, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleApi } from "../../../stores/slices/scheduleSlice";
import { format } from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1));
  const dispatch = useDispatch();
  const { schedule, isLoading, error } = useSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(getScheduleApi());
  }, [dispatch]);

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "dd-MM-yyyy HH:mm");
  };

  const getDaySchedule = (date) => {
    return schedule.filter((item) => {
      const scheduleDate = new Date(item.startTime);
      return (
        scheduleDate.getFullYear() === date.getFullYear() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getDate() === date.getDate()
      );
    });
  };

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

  if (isLoading) {
    return <Box className="text-center p-4">Đang tải...</Box>;
  }


  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    days.push({ date: day, isCurrentMonth: true });
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
        <Box className="flex gap-1">
          <Button variant="outlined" onClick={previousMonth}>
            <ChevronLeft />
          </Button>
          <Button variant="outlined" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </Box>
      </Box>

      <Box className="grid grid-cols-7 gap-px bg-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box key={day} className="p-2 text-center font-medium bg-gray-900">
            {day}
          </Box>
        ))}
      </Box>

      <Box className="grid grid-cols-7 gap-px bg-gray-700">
        {days.map(({ date, isCurrentMonth }, index) => {
          const daySchedules = getDaySchedule(date);

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
                  <Box
                    key={schedule.tutorAvailabilityId}
                    className={`text-xs p-1 rounded truncate ${
                      schedule.status === "Available"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {formatDateTime(schedule.startTime)} - {schedule.tutorAvailabilityId}
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
