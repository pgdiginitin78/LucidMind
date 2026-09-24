import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { motion } from "framer-motion";

export default function SelectField({
  control,
  name,
  label,
  options,
  error,
  disabled = false,
  ...rest
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FormControl fullWidth error={!!error} disabled={disabled}>
            <InputLabel
              sx={{
                fontWeight: 500,
                "&.Mui-focused": {
                  fontWeight: 600,
                },
              }}
            >
              {label}
            </InputLabel>
            <Select
              {...field}
              label={label}
              sx={{
                borderRadius: "0.75rem",
                backgroundColor: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#fafafa",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "2px",
                  },
                },
              }}
              {...rest}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <FormHelperText sx={{ marginLeft: "4px", fontWeight: 500 }}>
                {error.message}
              </FormHelperText>
            )}
          </FormControl>
        </motion.div>
      )}
    />
  );
}