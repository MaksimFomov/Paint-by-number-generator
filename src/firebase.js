import { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE0cHHmZEkruP-zKDIe8In8V2fdCMOS0c",
  authDomain: "paint-by-number-generato-86a44.firebaseapp.com",
  databaseURL: "https://paint-by-number-generato-86a44-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "paint-by-number-generato-86a44",
  storageBucket: "paint-by-number-generato-86a44.appspot.com",
  messagingSenderId: "402212630099",
  appId: "1:402212630099:web:692f86f2862515d4b0e0a6",
  measurementId: "G-7V2J8MB6K2"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);

// eslint-disable-next-line no-unused-vars
const database = getDatabase();

// eslint-disable-next-line no-unused-vars
const auth = getAuth();

export function signup(email,passsword) {
return createUserWithEmailAndPassword(auth,email,passsword);
}

export function login(email,passsword) {
  return signInWithEmailAndPassword(auth,email,passsword);
  }

export function logout(){
  signOut(auth);
}
//Hook
export function useAuth()
{
const [currentUser, setCurrentUser] = useState();

useEffect(()=>{
 const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
 return unsub;
},[])

return currentUser;
}