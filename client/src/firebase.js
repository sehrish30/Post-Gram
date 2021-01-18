import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU7UDfc-KgnHWHBjRJQP3aI6KxPb-qRxw",
  authDomain: "postgram-eeb86.firebaseapp.com",
  projectId: "postgram-eeb86",
  storageBucket: "postgram-eeb86.appspot.com",
  //   messagingSenderId: "455076278462",
  appId: "1:455076278462:web:5b5df206801b8e3348aeef",
  measurementId: "G-DY40EK13CE",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
