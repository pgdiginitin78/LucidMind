import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

const RadioField = ({
  dataArray = [],
  name,
  label,
  control,
  defaultValue = "",
  className = "",
  sx,
  labelSx,
  radioSx,
  row = true,
}) => {
  return (
    <FormControl className={className} sx={sx}>
      {label && (
        <FormLabel
          id={`${name}-radio-label`}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            fontWeight: 500,
            mb: 0.5,
            "&.Mui-focused": {
              color: "#00C4FF",
            },
            ...labelSx,
          }}
        >
          {label}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <RadioGroup
            row={row}
            aria-labelledby={`${name}-radio-label`}
            name={field.name}
            value={field.value ?? defaultValue}
            onChange={(e, val) => field.onChange(val ?? e.target.value)}
            onBlur={field.onBlur}
            sx={{
              display: "flex",
              gap: 2,
              ...sx,
            }}
          >
            {dataArray.map((p) => (
              <FormControlLabel
                key={name + p.id}
                value={p.id}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      "&.Mui-checked": {
                        color: "#00C4FF",
                      },
                      ...radioSx,
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: "#ffffff",
                      fontWeight: 500,
                    }}
                  >
                    {p.label}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default RadioField;