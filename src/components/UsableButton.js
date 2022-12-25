import React from "react";
import "../css/usablebutton.css";
function UsableButton({
  color,
  title,
  style,
  onPress = () => {},
  disabled = false,
}) {
  return (
    <>
      <div style={style} onClick={disabled ? undefined : onPress}>
        <div
          className="button-container"
          style={{
            backgroundColor: color,
            userSelect: disabled ? "none" : "all",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <p className="button-text" color="white">
            {title}
          </p>
        </div>
      </div>
    </>
  );
}

export default UsableButton;
