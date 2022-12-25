import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/game.css";
import { FaRegCircle, FaTimes } from "react-icons/fa";
import colors from "../config/colors";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import UsableButton from "../components/UsableButton";
import BackIcon from "../components/BackIcon";

function Game() {
  const location = useLocation();
  const [currentdoc, setcurrentdoc] = useState([]);
  const [array, setArray] = useState(["", "", "", "", "", "", "", "", ""]);
  const [index, setIndex] = useState(-1);
  const [gametitle, setGametitle] = useState("");
  const navigate = useNavigate();

  const updateArray = async () => {
    let status = "";
    let winner = "";
    let ar = array;
    ar[index] = location.state.username;
    setIndex(-1);
    setArray(ar);
    await setDoc(
      doc(collection(getFirestore(), "games"), location.state.docid),
      {
        gameArray: ar,
        currentTurn:
          currentdoc.currentTurn === location.state.username &&
          currentdoc.me === location.state.username
            ? currentdoc.opposition
            : currentdoc.me,
        timestamp: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    ).then(async () => {
      const docs = await getDoc(
        doc(getFirestore(), "games", location.state.docid)
      );
      let arr = docs.data().gameArray;
      for (let i = 0; i < 7; i = i + 3) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
          if (arr[i + j] !== "") {
            sum += arr[i + j] === location.state.username ? 1 : -1;
          }
        }

        if (sum === 3) {
          status = "won";
          winner = location.state.username;
        } else if (sum === -3) {
          status = "won";
          winner =
            currentdoc.me === location.state.username
              ? currentdoc.opposition
              : currentdoc.me;
        }
      }
      for (let i = 0; i < 3; i++) {
        let colsum = 0;
        for (let j = 0; j < 7; j = j + 3) {
          if (arr[i + j] !== "") {
            colsum +=
              arr[j + i] === location.state.username && arr[j + i] !== ""
                ? 1
                : -1;
          }
        }

        if (colsum === 3) {
          status = "won";
          winner = location.state.username;
        } else if (colsum === -3) {
          status = "won";
          winner =
            currentdoc.me === location.state.username
              ? currentdoc.opposition
              : currentdoc.me;
        }
      }

      if (
        ar[0] === location.state.username &&
        arr[4] === location.state.username &&
        arr[8] === location.state.username
      ) {
        status = "won";
        winner = location.state.username;
      } else if (
        arr[0] === arr[4] &&
        arr[4] === arr[8] &&
        arr[0] ===
          (currentdoc.me === location.state.username
            ? currentdoc.opposition
            : currentdoc.me)
      ) {
        status = "won";
        winner =
          currentdoc.me === location.state.username
            ? currentdoc.opposition
            : currentdoc.me;
      }
      if (
        arr[2] === location.state.username &&
        arr[4] === location.state.username &&
        arr[6] === location.state.username
      ) {
        status = "won";
        winner = location.state.username;
      } else if (
        arr[2] === arr[4] &&
        arr[4] === arr[6] &&
        arr[2] ===
          (currentdoc.me === location.state.username
            ? currentdoc.opposition
            : currentdoc.me)
      ) {
        status = "won";
        winner =
          currentdoc.me === location.state.username
            ? currentdoc.opposition
            : currentdoc.me;
      }
      if (!arr.includes("") && status === "") {
        status = "draw";
      }
      await setDoc(
        doc(collection(getFirestore(), "games"), location.state.docid),
        {
          status: status,
          winner: winner,
        },
        { merge: true }
      ).then(() => {
        getDocument();
      });
    });
  };

  const getDocument = async () => {
    setGametitle("");
    const document = await getDoc(
      doc(getFirestore(), "games", location.state.docid)
    );
    setcurrentdoc(document.data());
    setArray(document.data().gameArray);
    if (
      document.data().currentTurn === location.state.username &&
      document.data().status === ""
    ) {
      setGametitle("Your move");
    } else if (
      document.data().currentTurn !== location.state.username &&
      document.data().status === ""
    ) {
      setGametitle("Their move");
    } else if (
      location.state.username === document.data().winner &&
      document.data().status !== "draw"
    ) {
      setGametitle("You win!");
    } else if (
      location.state.username !== document.data().winner &&
      document.data().status !== "draw"
    ) {
      setGametitle("You lose!");
    } else {
      setGametitle("It's a draw!");
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <div className="game-section">
      <BackIcon />
      <h1>
        Game with{" "}
        {currentdoc.me === location.state.username
          ? currentdoc.opposition
          : currentdoc.me}
      </h1>
      <p>Your piece</p>
      <FaTimes color={colors.blue} size={50} style={{ margin: "1rem" }} />
      <div style={{ backgroundColor: colors.cream }} className="name-section">
        <p>{gametitle}</p>
      </div>
      <table className="table-section">
        <tr>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
              borderBottom: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[0] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(0);
              }
            }}
          >
            {array[0] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[0] !== location.state.username && array[0] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 0 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
              borderBottom: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[1] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(1);
              }
            }}
          >
            {array[1] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[1] !== location.state.username && array[1] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 1 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            style={{
              borderBottom: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[2] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(2);
              }
            }}
          >
            {array[2] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[2] !== location.state.username && array[2] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 2 && <FaTimes color={colors.blue} size={100} />}
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
              borderBottom: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[3] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(3);
              }
            }}
          >
            {array[3] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[3] !== location.state.username && array[3] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 3 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
              borderBottom: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[4] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(4);
              }
            }}
          >
            {array[4] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[4] !== location.state.username && array[4] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 4 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            onClick={() => {
              if (
                array[5] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(5);
              }
            }}
            style={{
              borderBottom: `10px solid ${colors.cream}`,
            }}
          >
            {array[5] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[5] !== location.state.username && array[5] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 5 && <FaTimes color={colors.blue} size={100} />}
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[6] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(6);
              }
            }}
          >
            {array[6] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[6] !== location.state.username && array[6] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 6 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            style={{
              borderRight: `10px solid ${colors.cream}`,
            }}
            onClick={() => {
              if (
                array[7] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(7);
              }
            }}
          >
            {array[7] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[7] !== location.state.username && array[7] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 7 && <FaTimes color={colors.blue} size={100} />}
          </td>
          <td
            onClick={() => {
              if (
                array[8] === "" &&
                currentdoc.status === "" &&
                currentdoc.currentTurn === location.state.username
              ) {
                setIndex(8);
              }
            }}
          >
            {array[8] === location.state.username && (
              <FaTimes color={colors.blue} size={100} />
            )}
            {array[8] !== location.state.username && array[8] !== "" && (
              <FaRegCircle color={colors.red} size={90} />
            )}
            {index === 8 && <FaTimes color={colors.blue} size={100} />}
          </td>
        </tr>
      </table>
      {currentdoc.currentTurn !== location.state.username &&
        currentdoc.status === "" && (
          <UsableButton
            onPress={() => {
              console.log(currentdoc.currentTurn !== location.state.username);
            }}
            disabled={currentdoc.currentTurn !== location.state.username}
            color={
              currentdoc.currentTurn === location.state.username
                ? colors.yellow
                : "#E0E0E0"
            }
            title={
              currentdoc.currentTurn === location.state.username
                ? "Submit"
                : `Waiting for ${
                    currentdoc.me === location.state.username
                      ? currentdoc.opposition
                      : currentdoc.me
                  }`
            }
          />
        )}
      {currentdoc.currentTurn === location.state.username &&
        currentdoc.status === "" && (
          <UsableButton
            onPress={() => {
              updateArray();
            }}
            disabled={currentdoc.currentTurn !== location.state.username}
            color={
              currentdoc.currentTurn === location.state.username
                ? colors.yellow
                : "#E0E0E0"
            }
            title={
              currentdoc.currentTurn === location.state.username
                ? "Submit"
                : `Waiting for ${
                    currentdoc.me === location.state.username
                      ? currentdoc.opposition
                      : currentdoc.me
                  }`
            }
          />
        )}
      {currentdoc.status !== "" && (
        <UsableButton
          title={"Start another game"}
          color={colors.yellow}
          onPress={() => {
            navigate("/newgame", {
              state: { username: location.state.username },
            });
          }}
        />
      )}
    </div>
  );
}

export default Game;
