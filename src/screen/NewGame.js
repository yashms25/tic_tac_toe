import React, { useState } from "react";
import CommonInput from "../components/CommonInput";
import Error from "../components/Error";
import ErrorMessage from "../components/ErrorMessage";
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

function NewGame() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errormsg, setErrormsg] = useState("This email doesn't exist.");
  const [errorbool, setErrorBool] = useState(false);
  const location = useLocation();
  const onPress = async () => {
    if (email === "") {
      setError(true);
    } else {
      try {
        setErrorBool(false);
        onAuthStateChanged(getAuth(), async (user) => {
          if (user) {
            if (email === user.email) {
              setErrorBool(true);
              setErrormsg("You can't enter your email.");
            } else {
              const q = query(
                collection(getFirestore(), "users"),
                where("email", "==", email)
              );
              const querySnapshot = await getDocs(q);
              if (querySnapshot.size === 0) {
                setErrorBool(true);
                setEmail("");
                setErrormsg("This email doesn't exist.");
              } else {
                querySnapshot.forEach(async (docs) => {
                  // navigate("/game", { state: { username: doc.data().username } });
                  //   doc.data().username;

                  let docid = await addDoc(
                    collection(getFirestore(), "games"),
                    {
                      gameArray: ["", "", "", "", "", "", "", "", ""],
                      currentTurn: location.state.username,
                      me: location.state.username,
                      opposition: docs.data().username,
                      status: "",
                      timestamp: Timestamp.fromDate(new Date()),
                      winner: "",
                    }
                  );
                  console.log(docid.id);
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
      } catch {
        setErrorBool(true);
        setEmail("");
      }
    }
  };
  return (
    <div className="register-section">
      <BackIcon />
      <h4>Start a new game</h4>
      <h1>Whom do you want to play with?</h1>
      <div className="input-section">
        <p>Email</p>
        <CommonInput
          type={"email"}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            let validRegex =
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (e.target.value.match(validRegex)) {
              setError(false);
            } else {
              setError(true);
            }
          }}
          placeholder={"Type their email here"}
        />
        {error && (
          <ErrorMessage title={"Please enter valid email"} color={colors.red} />
        )}
      </div>
      <UsableButton
        color={colors.yellow}
        title={"Start game"}
        onPress={onPress}
      />
      {errorbool && <Error color={colors.red} title={errormsg} />}
    </div>
  );
}

export default NewGame;
