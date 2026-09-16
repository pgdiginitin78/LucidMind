import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import AddIcon from "@mui/icons-material/Add";

const CommonButton = ({
  type,
  onClick,
  label,
  className,
  disabled,
  searchIcon,
  cancelIcon,
  icon,
  addIcon,
  fullWidth,
}) => {
  if (fullWidth === undefined || fullWidth === null) {
    fullWidth = false;
  }

  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
      className={
        !disabled || disabled === undefined || disabled === null
          ? !fullWidth
            ? `h-9 px-3 w-max rounded text-center justify-center cursor-pointer flex items-center space-x-2 shadow align-bottom  text-sm font-medium ${className}`
            : `h-9 px-3 w-full lg:w-max rounded text-center justify-center cursor-pointer flex items-center space-x-2 shadow align-bottom  text-sm font-medium ${className}`
          : !fullWidth
            ? `h-9 px-3 w-max rounded text-center justify-center  text-sm flex items-center align-bottom shadow space-x-2 font-medium bg-gray-400  text-white ${className}`
            : `h-9 px-3 w-full lg:w-max rounded text-center justify-center  text-sm flex items-center align-bottom shadow space-x-2 font-medium bg-gray-400  text-white ${className}`
      }
    >
      {searchIcon && <SearchIcon className="cursor-pointer" />}
      {cancelIcon && <CancelPresentationIcon className="cursor-pointer" />}
      {addIcon && <AddIcon className="cursor-pointer" />}
      {icon} &nbsp;
      {label}
    </button>
  );
};

export default CommonButton;
