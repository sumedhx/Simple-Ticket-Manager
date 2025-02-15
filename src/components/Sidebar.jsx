import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link, Location, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <aside className="sidebar">
      {userData ? (
        <>
          <h2>User Details</h2>
          <p><strong>Name:</strong> {userData.Name}</p>
          <p><strong>Role:</strong> {userData.Role}</p>
          <p><strong>Email:</strong> {userData.Email}</p>

            {location.pathname == '/dashboard' ? <Link className="asideBtn-link" to="/manage-tickets"><button className="asideBtn">Manage Tickets</button></Link> : <Link className="asideBtn-link" to="/dashboard"><button className="asideBtn">Dashboard</button></Link>}

          <button className="asideBtn" onClick={() => signOut(auth)}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </aside>
  );
};

export default Sidebar;
