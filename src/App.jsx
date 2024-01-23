import { useState, useEffect } from 'react';
import './App.css';
import Auth from './Login/Auth';
import app from './FirebaseSetup/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDoc, getFirestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import Client from './Manager/Client';
import Admin from './Manager/Admin';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user is not anonymous
        const { uid, email } = user;

        // Fetch additional user data
        const userData = await fetchUserData(uid);

        setUser({
          uid,
          email,
          ...userData,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch additional user data
  const fetchUserData = async (uid) => {
    const firestore = getFirestore(app);

    try {
      const userDocRef = doc(firestore, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const { isAdmin, isDean, block } = userDocSnapshot.data();

        return {
          isAdmin,
          isDean,
          block,
        };
      }

      return {};
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  };

  useEffect(() => {
    const handleAcceptedRequests = async () => {
      if (user && (user.isAdmin || user.isDean)) {
        const firestore = getFirestore(app);
  
        // Fetch requests that are approved by both Admin and Dean
        const approvedRequestsQuery = query(collection(firestore, 'requests'), where('isApprovedByAdmin', '==', true), where('isApprovedByDean', '==', true));
        const approvedRequestsSnapshot = await getDocs(approvedRequestsQuery);
  
        // Remove accepted requests from the 'requests' collection
        approvedRequestsSnapshot.forEach(async (requestDoc) => {
          const requestDocRef = doc(firestore, 'requests', requestDoc.id);
          await deleteDoc(requestDocRef);
        });
  
        // Post accepted requests in the 'approved' collection
        approvedRequestsSnapshot.forEach(async (requestDoc) => {
          const approvedDocRef = doc(firestore, 'approved', requestDoc.id);
          await setDoc(approvedDocRef, requestDoc.data());
        });
      }
    };
  
    handleAcceptedRequests();
  }, [user]);


  return (
    <div className='container'>
      {user ? (
        user.isDean ? (
          <div>
            <Admin block={'dean'} email={user.email} />
          </div>
        ) : user.isAdmin ? (
          <div>
            <Admin block={user.block} email={user.email} />
            <p>Hello Admin of {user.block} block</p>
          </div>
        ) : (
          <Client email={user.email} />
        )
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
