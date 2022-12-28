import React, { useState } from "react";
import CommonInput from "../components/CommonInput";

import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import "../css/registerpage.css";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import BackIcon from "../components/BackIcon";
import { Formik } from "formik";
import * as Yup from "yup";

import { email, name, password, username } from "../config/ValidationSchema";

function Registerpage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const validation = Yup.object().shape({
    name: name,
    password: password,
    username: username,
    email: email,
  });

  const onPress = async (values) => {
    const firestore = getFirestore();
    const auth = getAuth();
    const q1 = query(
      collection(getFirestore(), "users"),
      where("email", "==", values.email)
    );
    const q2 = query(
      collection(getFirestore(), "users"),
      where("username", "==", values.username)
    );
    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    if (querySnapshot1.size !== 0 || querySnapshot2.size !== 0) {
      if (querySnapshot1.size !== 0 && querySnapshot2.size !== 0) {
        setError("both");
      } else if (querySnapshot1.size !== 0) {
        setError("email");
      } else if (querySnapshot2.size !== 0) {
        setError("username");
      }
    } else {
      setError("success");
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await setDoc(doc(collection(firestore, "users"), values.username), {
        username: values.username,
        email: values.email,
        name: values.name,
      });
      navigate("/gamepage", { replace: true });
    }
  };
  return (
    <div className="register-section">
      {error === "email" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> This email is already taken!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setError("");
            }}
          ></button>
        </div>
      )}
      {error === "username" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> This username is already taken!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setError("");
            }}
          ></button>
        </div>
      )}
      {error === "both" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> This email and username are already taken!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setError("");
            }}
          ></button>
        </div>
      )}
      {error === "success" && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <strong>Succeess!</strong> Account created successfully!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setError("");
            }}
          ></button>
        </div>
      )}
      <BackIcon />
      <h4>Create account</h4>
      <h1>Let's get to know you better!</h1>
      <Formik
        initialValues={{ email: "", name: "", username: "", password: "" }}
        validationSchema={validation}
        onSubmit={(values) => {
          onPress(values);
        }}
      >
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <>
            <div className="input-section">
              <p>Your name</p>
              <CommonInput
                styles={{
                  border:
                    errors.name && touched.name
                      ? `1px solid ${colors.red}`
                      : `1px solid ${colors.green}`,
                }}
                type={"text"}
                value={values.name}
                onChange={handleChange("name")}
                placeholder={"Type your name here"}
              />
              {errors.name && touched.name && (
                <p
                  style={{
                    fontSize: 14,
                    marginBottom: "10px",
                    color: colors.red,
                  }}
                >
                  {errors.name}
                </p>
              )}
              <p>Username</p>
              <CommonInput
                styles={{
                  border:
                    errors.username && touched.username
                      ? `1px solid ${colors.red}`
                      : `1px solid ${colors.green}`,
                }}
                type={"text"}
                value={values.username}
                onChange={handleChange("username")}
                placeholder={"Type your username here"}
              />
              {errors.username && touched.username && (
                <p
                  style={{
                    fontSize: 14,
                    marginBottom: "10px",
                    color: colors.red,
                  }}
                >
                  {errors.username}
                </p>
              )}

              <p>Email</p>
              <CommonInput
                styles={{
                  border:
                    errors.email && touched.email
                      ? `1px solid ${colors.red}`
                      : `1px solid ${colors.green}`,
                }}
                type={"email"}
                value={values.email}
                onChange={handleChange("email")}
                placeholder={"Type your email here"}
              />
              {errors.email && touched.email && (
                <p
                  style={{
                    fontSize: 14,
                    marginBottom: "10px",
                    color: colors.red,
                  }}
                >
                  {errors.email}
                </p>
              )}

              <p>Password</p>
              <CommonInput
                styles={{
                  border:
                    errors.password && touched.password
                      ? `1px solid ${colors.red}`
                      : `1px solid ${colors.green}`,
                }}
                type={"password"}
                value={values.password}
                onChange={handleChange("password")}
                placeholder={"Type your password here"}
              />
              {errors.password && touched.password && (
                <p
                  style={{
                    fontSize: 14,
                    marginBottom: "10px",
                    color: colors.red,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>
            <UsableButton
              color={colors.yellow}
              title={"Register"}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </div>
  );
}

export default Registerpage;
