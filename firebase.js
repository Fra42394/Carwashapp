import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRckuixMRW_hy2H0nsx8A6lsDsgNxCQ_s",
  authDomain: "carwash-7db16.firebaseapp.com",
  projectId: "carwash-7db16",
  storageBucket: "carwash-7db16.firebasestorage.app",
  messagingSenderId: "884783958498",
  appId: "1:884783958498:web:a66218418bbacd04dc11bb",
  measurementId: "G-CHFH7TKKEF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;