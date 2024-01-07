/* eslint-disable react/prop-types */
import { useState } from "react";
import { Star } from "./Star";

// Styles
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1.6rem",
};

const starContainerStyle = {
  display: "flex",
};

// Actual Component
export const StarRating = ({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) => {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  const stars = Array.from({ length: maxRating }, (_, i) => (
    <Star
      key={i + 1}
      onRate={() => {
        setRating(i + 1);
        onSetRating(i + 1);
      }}
      full={i + 1 <= rating || i + 1 <= tempRating}
      onHoverIn={() => setTempRating(i + 1)}
      onHoverOut={() => setTempRating(0)}
      size={size}
      color={color}
    />
  ));

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>{stars}</div>

      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
};
