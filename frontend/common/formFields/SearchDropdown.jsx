import { KeyboardArrowDown } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import ReactSelect, { components } from "react-select";

const SearchDropdown = ({
  isDisabled,
  isMulti,
  placeholdernotVisible,
  searchIcon,
  control,
  error,
  name,
  dataArray,
  inputRef,
  placeholder,
  label,
  handleInputChange,
  menuShouldBlockScroll,
  menuPlacement,
  isClearable,
  onChange,
  defaultValue,
  autoFocus
}) => {
  const [width, setWidth] = useState(0);
  const [placeHolderTop, setPlaceHolderTop] = useState(false);


  const ref = useRef(null);


  let isError = !!error?.message;
  let bgColor = "rgba(255, 255, 255, 1)";

  useLayoutEffect(() => {
    if (isClearable == true) {
      let inPx = `${ref.current.offsetWidth - 96}px`;
      setWidth(inPx);
    } else {
      let inPx = `${ref.current.offsetWidth - 64}px`;
      setWidth(inPx);
    }
  }, []);

  if (menuPlacement) {
  } else {
    menuPlacement = "auto";
  }
  if (menuShouldBlockScroll !== true) {
    menuShouldBlockScroll = false;
  }

  const selectStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 20,
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "24px",
      minWidth: ref.current.offsetWidth,
      width: "fit-content",
    }),
    option: (provided, { isDisabled, isFocused, isSelected }) => ({
      ...provided,
      whiteSpace: "nowrap",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "rgba(222,235,255,1)"
        : isFocused
        ? "rgba(222,235,255,0.5)"
        : undefined,

      color: isDisabled
        ? undefined
        : isSelected
        ? "#000000"
        : isFocused
        ? "#000000"
        : undefined,
    }),
    control: (Colstyles, state) => ({
      ...Colstyles,
      borderRadius: "5px",
      minHeight: "36.3px",
      fontSize: "14px",
      maxHeight: "36.3px",
      border: isError
        ? state.isSelected
          ? "1px solid #DEEBFF"
          : state.isFocused
          ? "1px solid #DEEBFF"
          : state.hasValue || state.selectProps.inputValue
          ? "1px solid #d32f2f"
          : "1px solid #d32f2f"
        : state.hasValue || state.selectProps.inputValue
        ? ""
        : "",
      whiteSpace: "nowrap",
    }),
    singleValue: (Singstyles) => ({
      ...Singstyles,
      paddingLeft: "4px",
      fontSize: "14px",
    }),
    indicatorSeparator: (styles) => ({ display: "none", paddingX: "2px" }),
    container: (provided) => ({
      ...provided,
    }),
    valueContainer: (provided, state) => {
      return {
        ...provided,
        width: width,
        overflow: "hidden",
        fontSize: "14px",
        paddingLeft: state.hasValue || state.selectProps.inputValue ? 2 : 7,
        whiteSpace: "nowrap",
        flexWrap: "wrap",
        fontStyle: "normal",
      };
    },
    input: (provided, state) => ({
      ...provided,
    }),
    placeholder: (provided, state) => {
      return {
        ...provided,

        display: placeholdernotVisible
          ? placeHolderTop
            ? "block"
            : "block"
          : "block",
        position: "absolute",
        borderRadius: "2px",
        color: placeHolderTop
          ? isDisabled
            ? "#eaeaea"
            : "#1976D2"
          : isError
          ? "#d32f2f"
          : "#9e9e9e",
        fontSize: "14px",
        transition: "top 0.1s, font-size 0.1s",
        top: placeHolderTop ? -18 : 4,
        paddingLeft: placeHolderTop ? 4 : "",
        paddingRight: placeHolderTop ? 4 : "",
        backgroundColor: placeHolderTop
          ? isDisabled
            ? "#f0f0f0"
            : bgColor
          : "",
        zIndex: placeHolderTop ? 12 : "",
        fontStyle: "normal",
      };
    },
  };

  const fnhandleInputChange = (inputValue, { action, prevInputValue }) => {
    handleInputChange(inputValue);
  };



  return (
    <div className=" w-full" ref={ref}>
      <FormControl fullWidth>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field }) => (
            <ReactSelect
              className="text-[14px] w-full"
              inputRef={inputRef}
              {...field}
              ref={autoFocus}
         
              options={dataArray}
              defaultValue={defaultValue}
              isMulti={isMulti}
              label={label}
              isDisabled={isDisabled}
              placeholder={placeholder}
              openMenuOnClick={false}
              isClearable={isClearable}
              clearValue={true}
              styles={selectStyles}
              menuPlacement={menuPlacement}
              menuShouldBlockScroll={menuShouldBlockScroll}
              components={{
                DropdownIndicator: () =>
                  searchIcon ? (
                    <SearchIcon className="mr-1 text-slate-500" />
                  ) : (
                    <KeyboardArrowDown className="mr-1 text-gray-600" />
                  ),
                IndicatorSeparator: () => null,
                // ValueContainer: CustomValueContainer,
              }}
              onInputChange={fnhandleInputChange}
              blurInputOnSelect
            />
          )}
        />
      </FormControl>
    </div>
  );
};
export default SearchDropdown;
