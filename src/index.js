import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyCsvfNjRB4D-s5JjoH51Dj9cIcDG1dwMkw",
  authDomain: "telegram-bot-45f3c.firebaseapp.com",
  databaseURL: "https://telegram-bot-45f3c-default-rtdb.firebaseio.com",
  projectId: "telegram-bot-45f3c",
  storageBucket: "telegram-bot-45f3c.appspot.com",
  messagingSenderId: "438352716122",
  appId: "1:438352716122:web:a1c4fa1988319a8ce71363"
});

export default function Auth() {
  const [authState, setAuthState] = useState({ status: "loading" });

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          console.log(hasuraClaim, "Hasura Claim");
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");

          metadataRef.on("value", async data => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };

  let content;
  if (authState.status === "loading") {
    content = null;
  } else {
    content = (
      <React.Fragment>
        <div>
          {authState.status === "in" ? (
            <div>
              <h2>Welcome, {authState.user.displayName}</h2>
              <button onClick={signOut}>Sign out</button>
              <App authState={authState} />
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
        </div>
      </React.Fragment>
    );
  }

  return <div className="auth">{content}</div>;
}

ReactDOM.render(<Auth />, document.getElementById("root"));
