import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsableButton from "../components/UsableButton";
import colors from "../config/colors";
import "../css/gamepage.css";
import { getusername } from "../config/services";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from "@firebase/util";

function Gamepage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [username, setUsername] = useState("");

  const getGames = async (user) => {
    let gameArr = [];
    const user_name = await getusername(user.email);
    setUsername(user_name);
    const q = query(
      collection(getFirestore(), "games"),
      where("me", "==", user_name)
    );

    const q2 = query(
      collection(getFirestore(), "games"),
      where("opposition", "==", user_name)
    );
    const querySnapshot1 = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot1.forEach((doc) => {
      gameArr.push({ ...doc.data(), id: doc.id });
    });
    querySnapshot2.forEach((doc) => {
      gameArr.push({ ...doc.data(), id: doc.id });
    });

    setGames(gameArr.sort((a, b) => b.timestamp - a.timestamp));
  };
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        getGames(user);
      }
    });
  }, []);
  return (
    <div className="gamepage-section" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <h1>Your Games</h1>
        <UsableButton
          style={{ width: "100px" }}
          title={"Logout"}
          color={colors.blue}
          onPress={() => {
            getAuth().signOut();
            navigate("/", { replace: true });
          }}
        />
      </div>
      <div
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "2rem",
          backgroundColor: colors.purple,
          width: "3rem",
          height: "3rem",
          borderRadius: "10px",
          display: "flex",
          cursor: "pointer",
        }}
        onClick={async () => {
          navigate("/newgame", {
            state: { username: await getusername(getAuth().currentUser.email) },
          });
        }}
      >
        <p style={{ color: "white", margin: "auto" }}>+</p>
      </div>
      {games.length !== 0 ? (
        <div>
          {games.map((data) => {
            return (
              <div className="game-card">
                <div className="game-card-inner">
                  <h2>
                    Game with {data.me === username ? data.opposition : data.me}
                  </h2>
                  {data.currentTurn === username &&
                    data.status !== "won" &&
                    data.status !== "draw" && (
                      <p>
                        {data.me === username ? data.opposition : data.me} just
                        made their move! <br />
                        It's your turn to play now.
                      </p>
                    )}
                  {data.currentTurn !== username &&
                    data.status !== "won" &&
                    data.status !== "draw" && (
                      <p>
                        You've made your move! <br />
                        Waiting for them
                      </p>
                    )}

                  {data.status === "draw" && <p>It's a Draw!</p>}
                  {data.winner === username && data.status === "won" && (
                    <p>You won!</p>
                  )}
                  {data.winner !== username && data.status === "won" && (
                    <p>You lose!</p>
                  )}

                  <p style={{ margin: "1rem 0" }}>
                    {data.timestamp.toDate().toLocaleString()}
                  </p>
                  <UsableButton
                    onPress={() => {
                      navigate("/game", {
                        state: { docid: data.id, username: username },
                      });
                      console.log("id", data.id);
                    }}
                    color={colors.yellow}
                    title={
                      data.currentTurn === username && data.status === ""
                        ? "Play"
                        : "Visit game"
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <p className="main-heading">
            No Games <br />
            Found
          </p>
          <div style={{ width: "100%", padding: "0 1rem" }}>
            <UsableButton
              color={colors.yellow}
              onPress={() => {
                navigate("/newgame", { state: { username: username } });
              }}
              title={"Start a new game"}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Gamepage;
