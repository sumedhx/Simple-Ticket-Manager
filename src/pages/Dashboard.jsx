import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import CreateTicket from "./CreateTicket";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);


// Fetch Tickets
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const ticketsCollection = collection(db, "tickets"); 
    const q = query(ticketsCollection, orderBy("createdAt", "desc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketsList);
    });
  
    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  
  return (
    <section className="main">
      <aside>
        <h1>Hello</h1>
      </aside>
    </section>
  );
};

export default Dashboard;



