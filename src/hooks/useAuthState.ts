import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          const isAdmin = adminDoc.exists();
          
          setAuthState({
            user,
            isAdmin,
            loading: false,
          });
        } catch (error) {
          console.error('Error checking admin status:', error);
          setAuthState({
            user,
            isAdmin: false,
            loading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};