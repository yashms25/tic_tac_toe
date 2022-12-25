import React, { useState } from "react";
import CommonInput from "../components/CommonInput";
import Error from "../components/Error";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import ErrorMessage from "../components/ErrorMessage";
import "../css/registerpage.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BackIcon from "../components/BackIcon";

function Loginpage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const onPress = async () => {
    if (userName === "") {
      setUserNameError(true);
    }

    if (password === "") {
      setPasswordError(true);
    }

    if (!usernameError && !passwordError) {
      try {
        const q = query(
          collection(getFirestore(), "users"),
          where("username", "==", userName)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
          setError(true);
          setUserName("");
          setPassword("");
        } else {
          try {
            querySnapshot.forEach(async (doc) => {
              await signInWithEmailAndPassword(
                getAuth(),
                doc.data().email,
                password
              ).then(() => {
                console.log("signin done");
                navigate("/gamepage", { replace: true });
              });
            });
          } catch {
            setError(true);
            setUserName("");
            setPassword("");
          }
        }
      } catch {
        setError(true);
        setUserName("");
        setPassword("");
      }
    }
  };
  return (
    <div className="register-section">
      <BackIcon />
      <h4>Login</h4>
      <h1>Please enter your details</h1>
      <div className="input-section">
        <p>Username</p>
        <CommonInput
          type={"username"}
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (e.target.value) {
              setUserNameError(false);
            } else {
              setUserNameError(true);
            }
          }}
          placeholder={"Type your username here"}
        />
        {usernameError && (
          <ErrorMessage
            title={"Please enter your username"}
            color={colors.red}
          />
        )}
        <p>Password</p>
        <CommonInput
          type={"password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value) {
              setPasswordError(false);
            } else {
              setPasswordError(true);
            }
          }}
          placeholder={"Type your password here"}
        />
        {passwordError && (
          <ErrorMessage title={"Please enter password."} color={colors.red} />
        )}
      </div>
      <UsableButton color={colors.yellow} title={"Login"} onPress={onPress} />
      {error && <Error color={colors.red} title={"Enter correct details"} />}
    </div>
  );
}

export default Loginpage;
