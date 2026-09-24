import React from "react";

export default function Image({
  src,
  alt = "",
  fill = false,
  width,
  height,
  className = "",
  style = {},
  priority = false,
  sizes,
  ...props
}) {
  const mergedStyle = fill
    ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        ...style,
      }
    : style;

  return (
    <img
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      style={mergedStyle}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...props}
    />
  );
}
