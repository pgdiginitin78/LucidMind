import { FormControl } from "@mui/material";
import { DesktopTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";

function TimePickerField({
  name,
  label,
  control,
  defaultValue,
  disabled,
  sx,
  variant,
  inputProps,
  type,
  inputRef,
  format24hr,
  onChange,
  value,
  error,
  tableTimePicker,
  ...rest
}) {
  return (
    <div className="w-full">
      <FormControl className="w-full" sx={sx} size="small">
        <Controller
          sx={{ width: "100%", height: "40px" }}
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopTimePicker
                label={label}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                ampm={!format24hr}
                sx={{
              
                  "& .MuiInputBase-input": {
                    fontSize: tableTimePicker ? "11px" : "12px",
                    padding: "6px 14px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: tableTimePicker ? "11px" : "12px",
                    color: "#263d21 !important",
                    transform: tableTimePicker
                      ? "translate(14px, 7px) scale(1)"
                      : "translate(10px, 10px) scale(1)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(12px, -6px) scale(0.75)",
                      fontSize: tableTimePicker ? "10px" : "12px",
                    },
                  },
                  "& .MuiPickersOutlinedInput-root": {
                    fontSize: tableTimePicker ? "10px" : "12px",
                    padding: "6.5px 14px",
                  },
                  "& .MuiIconButton-root": {
                    padding: "5px",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: tableTimePicker ? "16px" : "22px",
                    color: disabled ? "#A9A9A9 !important" : "#263d21 !important",
                  },
                  "& .MuiPickersSectionList-root": {
                    padding: "0px 0px !important",
                    fontSize: tableTimePicker
                      ? "12px !important"
                      : "13px !important",
                  },
              
           
                  "& fieldset": {
                    borderColor: error ? "red !important" : "rgba(0, 0, 0, 0.23) !important",
                  },
                  "&:hover fieldset": {
                    borderColor:error ? "red !important" : "rgba(0, 0, 0, 0.87) !important",
                  },
                  "& .Mui-focused fieldset": {
                    borderColor: error ? "red !important" :"#1976d2 !important",
                  },
                }}
                {...rest}
              />
            </LocalizationProvider>
          )}
        />
      </FormControl>
    </div>
  );
}

export default TimePickerField;

{
  /* <TimePickerField
name="time24hr"
label="Select Time"
control={control}
defaultValue={new Date()}
format24hr={true} // Use 24-hour format

/>


<TimePickerField
name="time12hr"
label="Select Time"
control={control}
defaultValue={new Date()}
format24hr={false} // Use 12-hour format

/> */
}
