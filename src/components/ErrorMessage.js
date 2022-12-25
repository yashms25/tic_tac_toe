import React from "react";

function ErrorMessage({ title, color }) {
  return (
    <div style={{ marginBottom: "5px", marginTop: "-5px" }}>
      <p style={{ color: color }}>{title}</p>
    </div>
  );
}

export default ErrorMessage;
