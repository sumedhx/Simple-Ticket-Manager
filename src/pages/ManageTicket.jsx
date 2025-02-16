import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

const ManageTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalType, setModalType] = useState(null); // "view" or "edit"
  const [editData, setEditData] = useState({
    priority: "",
    status: "",
    assignedTo: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const ticketList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    };

    fetchTickets();
  }, []);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setModalType("view");
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setEditData({
      priority: ticket.priority || "",
      status: ticket.status || "Open",
      assignedTo: ticket.assignedTo || "",
    });
    setModalType("edit");
  };

  const currentUser = auth.currentUser;
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      await deleteDoc(doc(db, "tickets", id));
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    }
  };

  const handleSave = async () => {
    if (!selectedTicket) return;

    const ticketRef = doc(db, "tickets", selectedTicket.id);
    await updateDoc(ticketRef, {
      priority: editData.priority,
      status: editData.status,
      assignedTo: editData.assignedTo,
    });

    setTickets(tickets.map(ticket =>
      ticket.id === selectedTicket.id ? { ...ticket, ...editData } : ticket
    ));

    setSelectedTicket(null);
    setModalType(null);
  };

  return (
    <div className="manage-tickets">
      <Sidebar />
      <div className="ticket-container">
        <h2>Manage Tickets</h2>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} style={{ backgroundColor: ticket.priority === "High" ? "#ffcccc" : ticket.priority === "Medium" ? "#fff4cc" : "#ccffcc" }}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.priority || "N/A"}</td>
                <td>{ticket.status || "Open"}</td>
                <td>{ticket.assignedTo || "Unassigned"}</td>
                <td className="actionBtn-container">
                  <button className="actionBtn" onClick={() => handleView(ticket)}>View</button>
                  <button className="actionBtn" onClick={() => handleEdit(ticket)}>Edit</button>
                  {currentUser?.email !== "agent@support.com" && (
                        <button className="actionBtn" onClick={() => handleDelete(ticket.id)}>Delete</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View Modal */}
        {modalType === "view" && selectedTicket && (
          <div className="modal">
            <div className="modal-content">
              <h3>Ticket Details</h3>
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <p><strong>Date: </strong> {selectedTicket.createdAt ? new Date(selectedTicket.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</p>
              <p><strong>Time: </strong> {selectedTicket.createdAt ? new Date(selectedTicket.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A"}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority || "N/A"}</p>
              <p><strong>Status:</strong> {selectedTicket.status || "Open"}</p>
              <p><strong>Assigned To:</strong> {selectedTicket.assignedTo || "Unassigned"}</p>
              {selectedTicket.attachment && (
                <div>
                    <p><strong>Attachment:</strong></p>
                    <a href={selectedTicket.attachment} download target="_blank" rel="noopener noreferrer">
                    Download Attachment
                    </a>
                </div>
                 )}
              <button onClick={() => setModalType(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {modalType === "edit" && selectedTicket && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Ticket</h3>
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>

              <label>Priority:</label>
              <select value={editData.priority} onChange={(e) => setEditData({ ...editData, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label>Status:</label>
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>

              <label>Assign To:</label>
              <input
                type="text"
                value={editData.assignedTo}
                onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
              />

              <button onClick={handleSave}>Save</button>
              <button onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTicket;
