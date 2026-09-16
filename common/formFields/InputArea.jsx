"use client";

import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function InputArea({
  name,
  label,
  placeholder,
  defaultValue = "",
  control,
  minRows = 3,
  maxRows = 8,
  disabled,
  error,
  rules,
  className = "",
  id,
  sx,
  slotProps,
  InputProps,
  InputLabelProps,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <TextField
            id={inputId}
            name={name}
            label={label}
            placeholder={placeholder || ""}
            multiline
            minRows={minRows}
            maxRows={maxRows}
            disabled={disabled}
            error={Boolean(error?.message || error)}
            helperText={typeof error === "string" ? error : error?.message}
            variant="outlined"
            fullWidth
            slotProps={{
              inputLabel: {
                ...InputLabelProps,
                ...slotProps?.inputLabel,
                sx: {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "13.5px",
                  "&.Mui-focused": {
                    color: "#00C4FF !important",
                  },
                  "&.MuiFormLabel-filled": {
                    color: "rgba(0, 196, 255, 0.9)",
                  },
                  "&.Mui-error": {
                    color: "#ef4444 !important",
                  },
                  ...InputLabelProps?.sx,
                  ...slotProps?.inputLabel?.sx,
                },
              },
              input: {
                disabled: disabled,
                ...InputProps,
                ...slotProps?.input,
              },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "13.5px",
                "&.Mui-focused": {
                  color: "#00C4FF",
                },
                "&.MuiFormLabel-filled": {
                  color: "rgba(0, 196, 255, 0.9)",
                },
                "&.Mui-error": {
                  color: "#ef4444",
                },
              },
              "& .MuiOutlinedInput-root": {
                color: "#ffffff",
                fontSize: "13.5px",
                lineHeight: 1.5,
                borderRadius: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "rgba(0, 196, 255, 0.25)",
                  transition: "border-color 0.2s ease",
                },
                "&:hover fieldset": {
                  borderColor: "#2563EB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00C4FF",
                  borderWidth: "1.5px",
                },
              },
              "& .MuiFormHelperText-root": {
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "4px",
                marginLeft: "2px",
              },
              ...sx,
            }}
            {...field}
            {...props}
            value={field.value ?? ""}
          />
        )}
      />
    </div>
  );
}
