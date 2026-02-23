
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAsxJi3YJ25hCH1yLJj5XUZZ84oz3WlXTo",
  authDomain: "p2pfyp.firebaseapp.com",
  projectId: "p2pfyp",
  storageBucket: "p2pfyp.firebasestorage.app",
  messagingSenderId: "774198692848",
  appId: "1:774198692848:web:5c00a678f85fd18a4dab35"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)