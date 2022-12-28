import React from "react";
import "../css/homepage.css";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="home-section">
      <p className="async">async</p>
      <p className="main-heading">tic tac </p>
      <p className="main-heading">toe</p>
      <div style={{ width: "100%", padding: "0 1rem" }}>
        <UsableButton
          onPress={() => navigate("/login")}
          color={colors.yellow}
          title="Login"
        />
        <UsableButton
          onPress={() => navigate("/register")}
          color={colors.blue}
          title="Register"
        />
      </div>
    </div>
  );
}

export default Homepage;
