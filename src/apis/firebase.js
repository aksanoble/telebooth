/* eslint-disable no-useless-catch */
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

const provider = new firebase.auth.GoogleAuthProvider();

export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  });
};

export const authenticate = (callback) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      const idTokenResult = await user.getIdTokenResult();
      const hasuraClaim = idTokenResult.claims[process.env.REACT_APP_HASURA_CLAIMS];

      if (hasuraClaim) {
        callback({ status: 'in', user, token });
      } else {
        // Check if refresh is required.
        const metadataRef = firebase
          .database()
          .ref(`metadata/${user.uid}/refreshTime`);

        metadataRef.on('value', async (data) => {
          if (!data.exists) return;
          // Force refresh to pick up the latest custom claims changes.
          const updateToken = await user.getIdToken(true);

          callback({ status: 'in', user, token: updateToken });
        });
      }
    } else {
      callback({ status: 'out' });
    }
  });
};

export const logout = async () => {
  await firebase.auth().signOut();
};

export const signup = () => {
  firebase.auth().signInWithPopup(provider);
};
