import { useEffect } from "react"
import { useRouter } from "next/router"
import getCookie from "app/utils/getCookie"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { initializeApp } from "firebase/app"

const useInitialize = () => {
  const router = useRouter()

  const firebaseConfig = {
    apiKey: "AIzaSyCaZ7syo0diwAw0C0oIsnChWHuoa883O_0",
    authDomain: "mcymotor-6e707.firebaseapp.com",
    projectId: "mcymotor-6e707",
    storageBucket: "mcymotor-6e707.appspot.com",
    messagingSenderId: "888567859419",
    appId: "1:888567859419:web:7e48c13901c8eb27f3a4fe",
  }

  const firebase = initializeApp(firebaseConfig)

  return { firebase }
}

export default useInitialize
