import React from "react";
import "../css/error.css";

function Error({ color, title }) {
  return (
    <div className="error-section" style={{ backgroundColor: color }}>
      <p>{title}</p>
    </div>
  );
}

export default Error;
