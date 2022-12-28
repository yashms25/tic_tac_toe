import React from "react";
import "../css/commoninput.css";
import colors from "../config/colors";

function CommonInput({ type, placeholder, onChange, value, styles }) {
  return (
    <div>
      <input
        style={{ backgroundColor: colors.lightgrey, ...styles }}
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default CommonInput;
