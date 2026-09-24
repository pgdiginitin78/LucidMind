import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl } from "@mui/material";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import ReactSelect, { components } from "react-select";

const DropdownField = ({
  className,
  isDisabled,
  placeholdernotVisible,
  isMulti,
  inputRef,
  control,
  error,
  dataArray,
  name,
  onInputChange,
  placeholder,
  isClearable,
  maxMenuHeight,
  defaultValue,
  searchIcon,
  isSearchable,
  menuPlacement,
  menuShouldBlockScroll,
  referance,
  onKeyDown,
}) => {
  const ref = useRef(null);
  let isError = !!error?.message;
  let bgColor = "rgba(255, 255, 255, 1)";

  const [width, setWidth] = useState("full");

  if (menuPlacement) {
  } else {
    menuPlacement = "auto";
  }
  if (menuShouldBlockScroll !== true) {
    menuShouldBlockScroll = false;
  }

  useLayoutEffect(() => {
    if (isClearable) {
      setWidth(ref.current.offsetWidth - 75);
    } else {
      setWidth(ref.current.offsetWidth - 52);
    }
  }, []);

  if (isSearchable !== true) {
    isSearchable = false;
  }

  const selectStyles = {
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      boxShadow: "0 20px 54px 0 rgba(0,0,0,0.2)",
      zIndex: 9999,
      fontStyle: "normal",
      fontSize: "13px",
      lineHeight: "24px",
      minWidth: ref.current.offsetWidth,
      width: "fit-content",
    }),
    option: (provided, { isDisabled, isFocused, isSelected }) => ({
      ...provided,
      whiteSpace: "nowrap",
      zIndex: 9999,
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
        ? "#073763"
        : isFocused
        ? "#000000"
        : undefined,
    }),
    menuList: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
    control: (Colstyles, state) => ({
      ...Colstyles,
      borderRadius: "5px",
      fontSize: "13px",
      minHeight: "36.3px",
      maxHeight: "fit-content",
      textOverflow: "ellipsis",
      display: "flex",
      minWidth: "100%",
      textOverflow: "clipped",
      flexWrap: isMulti ? "wrap" : "nowrap",
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
    }),
    singleValue: (Singstyles) => ({
      ...Singstyles,
      display: "flex",
      paddingLeft: "4px",
      position: "absolute",
      width: width,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: "none",
      paddingX: "2px",
    }),
    indicatorContainer: (styles) => ({ ...styles, padding: "0px" }),

    clearIndicator: (styles) => ({
      ...styles,
      padding: "0px",
      cursor: "pointer",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      position: "relative",
      fontSize: "13px",
      whiteSpace: "nowrap",
      overflow: "visible",
      display: "flex",
      maxHeight: "fit-content",
      textOverflow: "clipped",
      flexWrap: isMulti ? "wrap" : "nowrap",
      paddingLeft: state.hasValue || state.selectProps.inputValue ? 2 : 5,
      padding: "0px",
      fontStyle: "normal",
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: "13px",
      overflow: "clip",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      display: placeholdernotVisible
        ? state.menuIsOpen ||
          state.selectProps.menuIsOpen ||
          state.hasValue ||
          state.selectProps.inputValue
          ? "none"
          : "block"
        : "block",

      position: "absolute",
      fontSize: "11px",
      borderRadius: "2px",
      color:
        state.menuIsOpen || state.selectProps.menuIsOpen
          ? isDisabled
            ? "#073763"
            : "#1976D2"
          : isError
          ? "#d32f2f"
          : "#9e9e9e",

      fontSize:
        (state.menuIsOpen ||
          state.selectProps.menuIsOpen ||
          state.hasValue ||
          state.selectProps.inputValue) &&
        11,
      transition: "top 0.1s, font-size 0.1s",

      top:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isSearchable
            ? -14
            : -13
          : isSearchable
          ? 4
          : "18%",

      paddingLeft:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 4
          : "",

      paddingRight:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 4
          : "",
      marginBottom:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 2
          : "",

      backgroundColor:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isDisabled
            ? "#f0f0f0"
            : bgColor
          : "",
      color:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? isDisabled
            ? "#073763"
            : "#073763"
          : "",

      zIndex:
        state.menuIsOpen ||
        state.selectProps.menuIsOpen ||
        state.hasValue ||
        state.selectProps.inputValue
          ? 10
          : "",

      fontStyle: "normal",
    }),
  };
  const { ValueContainer, Placeholder } = components;

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };
  return (
    <div className=" w-full" ref={ref}>
      <FormControl fullWidth sx={{ overFlowX: "hidden" }}>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field }) => (
            <ReactSelect
              className={className + "text-[14px] text-gray-600 w-full"}
              isDisabled={isDisabled}
              inputRef={inputRef}
              {...field}
              ref={referance}
              onKeyDown={onKeyDown}
              isMulti={isMulti}
              closeMenuOnSelect={isMulti ? false : true}
              maxMenuHeight={maxMenuHeight}
              options={dataArray}
              isClearable={isClearable}
              clearValue={true}
              isSearchable={true}
              placeholder={placeholder}
              defaultValue={defaultValue}
              styles={selectStyles}
              blurInputOnSelect={true}
              menuPlacement={menuPlacement}
              menuShouldBlockScroll={menuShouldBlockScroll}
              onInputChange={onInputChange}
              menuPortalTarget={document.body}
              components={{
                DropdownIndicator: () =>
                  isMulti ? (
                    <KeyboardArrowDownIcon
                      sx={{
                        "& .css-1xc3v61-indicatorContainer": {
                          padding: "0px",
                        },
                      }}
                      className="text-gray-600 p-0"
                    />
                  ) : searchIcon ? (
                    <SearchIcon className=" text-gray-600 p-0 mx-1" />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{
                        "& .css-1xc3v61-indicatorContainer": {
                          padding: "0px",
                        },
                      }}
                      className="text-gray-600 p-0"
                    />
                  ),
                ValueContainer: CustomValueContainer,
              }}
            />
          )}
        />
      </FormControl>
    </div>
  );
};

export default DropdownField;
