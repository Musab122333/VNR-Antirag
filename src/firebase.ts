// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCY0zFIp87uwZUwy2CLpTyz6GY9o4Tmpo",
  authDomain: "vnr-antirag.firebaseapp.com",
  projectId: "vnr-antirag",
  storageBucket: "vnr-antirag.firebasestorage.app",
  messagingSenderId: "889635103028",
  appId: "1:889635103028:web:96db89b13db0cb7b1c8561",
  measurementId: "G-40DBKP5PDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);