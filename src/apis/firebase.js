// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,signInWithPopup   } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcEN3JkEeNTar9eSJdkoo2gY5Ut_xZjgw",
  authDomain: "swd3-4bee1.firebaseapp.com",
  projectId: "swd3-4bee1",
  storageBucket: "swd3-4bee1.firebasestorage.app",
  messagingSenderId: "270966202809",
  appId: "1:270966202809:web:2d494ccc34e8b2706a9668",
  measurementId: "G-WN9C65VHQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, doc, setDoc, getDoc,googleProvider,signInWithPopup  };