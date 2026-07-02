
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";


export const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const previousStatus = useRef(null)

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("auth state changed:", currentUser)
      if (currentUser){
        setUser(currentUser)
      } else{
        setUser(null)
      } 
      setLoading(false)
    });
    return () => unsub()
  }, [])

  //effect for banned/suspended users, if user gets banned or suspended while logged in, they will be signed out and not able to log in again unless unbanned
  useEffect(() => {
    if (!user) return;
    console.log("previous status: ", previousStatus.current)
    const userRef = doc(db, "users", user.uid)
    const unsub = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) return
      const status = snap.data()?.status
      if(status === "banned"){
        console.log("banned")
        await signOut(auth)
        setUser(null)
      } else if ((status === "suspended" && previousStatus.current === "active")) {
        console.log("suspended")
        await signOut(auth)
        setUser(null)
      }

      previousStatus.current = status;
      console.log("previous status CHANGE: ", previousStatus.current)
  })

  return () => unsub()
}, [user])

  return (
    <Context.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children}
    </Context.Provider>
  );
}

export function useAuth() {
  return useContext(Context)
}