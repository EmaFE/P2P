
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const Context = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser){
        setUser(currentUser)
      } else{
        setUser(null)
      } 
    });
    return () => unsub();
  }, []);

  return (
    <Context.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children}
    </Context.Provider>
  );
}

export function useAuth() {
  return useContext(Context);
}