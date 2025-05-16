import React from "react";

interface IframeDisplayProps {
  src: string;
  width?: string;
  height?: string;
}

const IframeDisplay: React.FC<IframeDisplayProps> = ({
  src,
  width = "600",
  height = "550",
}) => {
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={{ border: "none" }}
    ></iframe>
  );
};

export default IframeDisplay;
