import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { useNavigate} from "react-router-dom";
import { collection, doc, getDoc, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";
import CreateTicket from "../components/CreateTicket";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  console.log(user)
  const [userData, setUserData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch user data
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch tickets
  useEffect(() => {
    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="container">
      
      <Sidebar />
      <div className="main">
        {userData.Email === "customer@support.com" 
          ? 
            <div className="ticketBtn">
              <button onClick={() => setShowModal(true)}>+ Create Ticket</button>
              {showModal && (
                <div className="modal">
                  <div className="modal-content">
                    <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                    <CreateTicket />
                  </div>
                </div>
              )}
            </div>
          : <h1>Recent Tickets</h1>
        }

        <table border="1">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id } style={{ backgroundColor: ticket.priority === "High" ? "#ffcccc" : ticket.priority === "Medium" ? "#fff4cc" : "#ccffcc" }}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.priority || "N/A"}</td>
                <td>{ticket.status || "Open"}</td>
                <td>{ticket.createdBy || "Unknown"}</td>
                <td>{ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                <td>{ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
