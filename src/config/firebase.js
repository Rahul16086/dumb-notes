import firebase from "firebase/app";
import "firebase/auth";
import { firebaseKey } from "../APIkeys";

// Initialize Firebase
firebase.initializeApp(firebaseKey);

export default firebase;
