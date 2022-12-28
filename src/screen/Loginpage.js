import React, { useState } from "react";
import CommonInput from "../components/CommonInput";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
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
import { Formik } from "formik";
import * as Yup from "yup";
import { password, username } from "../config/ValidationSchema";

import BackIcon from "../components/BackIcon";

function Loginpage() {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const validation = Yup.object().shape({
    password: password,
    username: username,
  });
  const onPress = async (values) => {
    const q = query(
      collection(getFirestore(), "users"),
      where("username", "==", values.username)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      setError("error");
    } else {
      querySnapshot.forEach(async (doc) => {
        await signInWithEmailAndPassword(
          getAuth(),
          doc.data().email,
          values.password
        )
          .then(() => {
            console.log("signin done");
            setError("success");
            setTimeout(() => {
              navigate("/gamepage", { replace: true });
            }, 1000);
          })
          .catch(() => {
            setError("error");
          });
      });
    }
  };
  return (
    <div className="register-section">
      {error === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> Invalid credentials!
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
          <strong>Success! </strong>Login successfull!
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
      <h4>Login</h4>
      <h1>Please enter your details</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validation}
        onSubmit={(values) => {
          onPress(values);
        }}
      >
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <>
            <div className="input-section">
              <p>Username</p>
              <CommonInput
                styles={{
                  border:
                    errors.username && touched.username
                      ? `1px solid ${colors.red}`
                      : `1px solid ${colors.green}`,
                }}
                type={"username"}
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
              title={"Login"}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </div>
  );
}

export default Loginpage;
