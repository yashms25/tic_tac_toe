import React, { useState } from "react";
import CommonInput from "../components/CommonInput";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "../components/BackIcon";
import { Formik } from "formik";
import * as Yup from "yup";
import { email } from "../config/ValidationSchema";

function NewGame() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errmsg, setErrorMsg] = useState("");
  const location = useLocation();

  const validation = Yup.object().shape({
    email: email,
  });

  const onPress = async (values) => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        if (values.email === user.email) {
          setError("error");
          setErrorMsg("You can't enter your email.");
        } else {
          const q = query(
            collection(getFirestore(), "users"),
            where("email", "==", values.email)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size === 0) {
            setError("error");
            setErrorMsg("This email doesn't exist.");
          } else {
            querySnapshot.forEach(async (docs) => {
              let docid = await addDoc(collection(getFirestore(), "games"), {
                gameArray: ["", "", "", "", "", "", "", "", ""],
                currentTurn: location.state.username,
                me: location.state.username,
                opposition: docs.data().username,
                status: "",
                timestamp: Timestamp.fromDate(new Date()),
                winner: "",
              });
              navigate("/game", {
                state: {
                  docid: docid.id,
                  username: location.state.username,
                },
              });
            });
          }
        }
      }
    });
  };
  return (
    <div className="register-section">
      {error === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> {errmsg}
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
      <h4>Start a new game</h4>
      <h1>Whom do you want to play with?</h1>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validation}
        onSubmit={(values) => {
          onPress(values);
        }}
      >
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <>
            <div className="input-section">
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
                placeholder={"Type their email here"}
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
            </div>
            <UsableButton
              color={colors.yellow}
              title={"Start game"}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </div>
  );
}

export default NewGame;
