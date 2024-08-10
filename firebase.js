// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyduNWyOD23Hhn6q8p_Gnn_qjKhNnkVvE",
  authDomain: "inventory--management-b20d8.firebaseapp.com",
  projectId: "inventory--management-b20d8",
  storageBucket: "inventory--management-b20d8.appspot.com",
  messagingSenderId: "695100878268",
  appId: "1:695100878268:web:20b10147fca343b50a4fb9",
  measurementId: "G-VC2NRFKH1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app)
export { firestore,storage };