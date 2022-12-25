import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BackIcon() {
  const navigate = useNavigate();
  return (
    <div
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft size={20} />
    </div>
  );
}

export default BackIcon;
