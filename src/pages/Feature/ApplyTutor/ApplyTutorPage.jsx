import { Box, TextField, Button, Typography, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { applyTutorApi } from "../../../stores/slices/authSlice";
import { fetchAllLanguages } from "../../../stores/slices/languageSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ApplyTutorPage() {
  const dispatch = useDispatch();
  const { languages, isLoading: isLoadingLanguages } = useSelector((state) => state.language);

  useEffect(() => {
    dispatch(fetchAllLanguages());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("Address", data.Address);
    formData.append("Country", data.Country);
    formData.append("LanguageId", data.LanguageId);
    formData.append("Price", data.Price);
    formData.append("TeachingExperience", data.TeachingExperience);
    formData.append("Education", data.Education);
    formData.append("Document", data.Document[0]);

    const resultAction = await dispatch(applyTutorApi(formData));
    if (applyTutorApi.fulfilled.match(resultAction)) {
      toast.success("Application submitted successfully");
    } else {
      toast.error("Error submitting application: " + resultAction.payload);
    }
  };

  return (
      <Box
          className="apply-tutor-container"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 5,
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            boxShadow: 2,
          }}
      >
        <Typography variant="h4" className="apply-tutor-title" sx={{ mb: 2 }}>
          Apply to be a Tutor
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              {...register("Address", { required: "Address is required" })}
              error={!!errors.Address}
              helperText={errors.Address?.message}
          />

          <TextField
              fullWidth
              label="Country"
              variant="outlined"
              margin="normal"
              {...register("Country", { required: "Country is required" })}
              error={!!errors.Country}
              helperText={errors.Country?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.LanguageId}>
            <InputLabel>Language</InputLabel>
            <Controller
                name="LanguageId"
                control={control}
                rules={{ required: "Language is required" }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Language"
                    >
                      {isLoadingLanguages ? (
                          <MenuItem disabled>Loading languages...</MenuItem>
                      ) : (
                          languages.map((language) => (
                              <MenuItem key={language.languageId} value={language.languageId}>
                                {language.languageName}
                              </MenuItem>
                          ))
                      )}
                    </Select>
                )}
            />
            {errors.LanguageId && (
                <Typography color="error" variant="caption">
                  {errors.LanguageId.message}
                </Typography>
            )}
          </FormControl>

          <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              margin="normal"
              {...register("Price", { required: "Price is required" })}
              error={!!errors.Price}
              helperText={errors.Price?.message}
          />

          <TextField
              fullWidth
              label="Teaching Experience"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              {...register("TeachingExperience", {
                required: "Teaching Experience is required",
                minLength: { value: 10, message: "Teaching Experience must be at least 10 characters" }
              })}
              error={!!errors.TeachingExperience}
              helperText={errors.TeachingExperience?.message}
          />

          <TextField
              fullWidth
              label="Education"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              {...register("Education", {
                required: "Education is required",
                minLength: { value: 10, message: "Education must be at least 10 characters" }
              })}
              error={!!errors.Education}
              helperText={errors.Education?.message}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Document (CV, Certificates, etc.)
            </Typography>
            <input
                type="file"
                {...register("Document", { required: "Document is required" })}
                style={{ width: "100%" }}
            />
            {errors.Document && (
                <Typography color="error" variant="caption">
                  {errors.Document.message}
                </Typography>
            )}
          </Box>

          <Button
              variant="contained"
              type="submit"
              sx={{
                mt: 2,
                backgroundColor: "#fe7aac",
                color: "black",
                fontWeight: "bold",
                border: "2px solid black",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#ff9fc3"
                }
              }}
              fullWidth
          >
            Submit Application
          </Button>
        </form>
      </Box>
  );
}