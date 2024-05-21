// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase-config";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [userVerified, setUserVerified] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUserVerified(true);
      } else {
        setUserVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { loading, userVerified };
};

export default useAuth;
