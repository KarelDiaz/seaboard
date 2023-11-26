import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyCIsD0ylMGv6LUvvYq-3k-Rv6qR02B3vFc",
  authDomain: "seaboard-data.firebaseapp.com",
  projectId: "seaboard-data",
  storageBucket: "seaboard-data.appspot.com",
  messagingSenderId: "279786217232",
  appId: "1:279786217232:web:369017364f5f8a67784f95"
};


initializeApp(firebaseConfig)

export const db = getFirestore()
export const auth = getAuth()