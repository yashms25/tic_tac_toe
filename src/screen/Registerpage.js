import React, { useState } from "react";
import CommonInput from "../components/CommonInput";
import Error from "../components/Error";
import ErrorMessage from "../components/ErrorMessage";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import "../css/registerpage.css";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import BackIcon from "../components/BackIcon";

function Registerpage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const checkEmail = (email) => {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  const onPress = async () => {
    if (name === "") {
      setNameError(true);
    }
    if (userName === "") {
      setUserNameError(true);
    }
    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }
    if (!nameError && !usernameError && !passwordError && !emailError) {
      const firestore = getFirestore();
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(collection(firestore, "users"), userName), {
        username: userName,
        email: email,
        name: name,
      });
      setSuccess(true);
      navigate("/gamepage");
    }
  };
  return (
    <div className="register-section">
      <BackIcon />
      <h4>Create account</h4>
      <h1>Let's get to know you better!</h1>
      <div className="input-section">
        <p>Your name</p>
        <CommonInput
          type={"text"}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value) {
              setNameError(false);
            } else {
              setNameError(true);
            }
          }}
          placeholder={"Type your name here"}
        />
        {nameError && (
          <ErrorMessage title={"Please enter your name"} color={colors.red} />
        )}
        <p>Username</p>
        <CommonInput
          type={"text"}
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
        <p>Email</p>
        <CommonInput
          type={"email"}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            checkEmail(e.target.value);
          }}
          placeholder={"Type your email here"}
        />
        {emailError && (
          <ErrorMessage title={"Please enter valid email"} color={colors.red} />
        )}
        <p>Password</p>
        <CommonInput
          type={"password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value.length < 8) {
              setPasswordError(true);
            } else {
              setPasswordError(false);
            }
          }}
          placeholder={"Type your password here"}
        />
        {passwordError && (
          <ErrorMessage
            title={"Password must be 8 characters."}
            color={colors.red}
          />
        )}
      </div>
      <UsableButton
        color={colors.yellow}
        title={"Register"}
        onPress={onPress}
      />
      {success && (
        <Error
          color={colors.green}
          title={"Congratulations!! Account created"}
        />
      )}
    </div>
  );
}

export default Registerpage;
