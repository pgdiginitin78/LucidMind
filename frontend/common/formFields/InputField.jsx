"use client";

import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const InputField = ({
  sx,
  ref,
  focused,
  variant = "outlined",
  defaultValue = "",
  inputProps,
  InputProps,
  InputLabelProps,
  type = "text",
  disabled,
  inputRef,
  name,
  label,
  placeholder,
  error,
  onKeyDown,
  control,
  color,
  tableInputField,
  accept,
  id,
  onClick,
  minRows,
  maxRows,
  multiline,
  slotProps,
  className = "",
  fullWidth = true,
  size = "small",
  rules,
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => {
          return (
            <TextField
              id={inputId}
              inputRef={inputRef}
              ref={ref ? ref : null}
              autoComplete="off"
              onKeyDown={onKeyDown}
              onClick={onClick}
              minRows={minRows}
              maxRows={maxRows}
              multiline={multiline}
              autoFocus={Boolean(focused)}
              type={type}
              disabled={disabled}
              label={label}
              error={Boolean(error?.message || error)}
              helperText={typeof error === "string" ? error : error?.message}
              color={color}
              variant={variant}
              placeholder={placeholder !== undefined ? placeholder : ""}
              name={name}
              fullWidth={fullWidth}
              size={size}
              onWheel={(e) => {
                if (type === "number") {
                  e.target.blur();
                }
              }}
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
                htmlInput: {
                  accept: accept,
                  ...inputProps,
                  ...slotProps?.htmlInput,
                  style: {
                    fontSize: tableInputField ? "12px" : "13.5px",
                    color: "#ffffff",
                    ...(tableInputField ? { height: "10px" } : {}),
                    ...inputProps?.style,
                    ...slotProps?.htmlInput?.style,
                  },
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
                  fontSize: tableInputField ? "12px" : "13.5px",
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
              value={field.value ?? ""}
            />
          );
        }}
      />
    </div>
  );
};

export default InputField;
