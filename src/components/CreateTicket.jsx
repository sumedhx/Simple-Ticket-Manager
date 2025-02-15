import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Technical Issue");
  const [deadline, setDeadline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [status, setStatus] = useState("Open");

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {
        title,
        description,
        priority,
        category,
        deadline,
        contactEmail,
        contactPhone,
        isUrgent,
        createdBy: auth.currentUser?.email || "Unknown",
        status,
        assignedTo: "",
        createdAt: new Date(),
        attachment: attachment ? attachment.name : null,
      };

      await addDoc(collection(db, "tickets"), ticketData);
      alert("Ticket Created Successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("Low");
      setCategory("Technical Issue");
      setDeadline("");
      setContactEmail("");
      setContactPhone("");
      setIsUrgent(false);
      setAttachment(null);
      setStatus("Open");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="createTicket">
      <h2>Create a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option>Technical Issue</option>
          <option>Billing</option>
          <option>Account</option>
          <option>Other</option>
        </select>

        <div className="deadline-container">
          <label>Deadline:</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        <input type="email" placeholder="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />

        <input type="tel" placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />

        <label className="checkbox-container">
          <input type="checkbox" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} />
          Mark as Urgent
        </label>

        <div className="file-upload">
          <input type="file" onChange={handleFileChange} />
          {attachment && (
            <div className="attachment-preview">
              <span>{attachment.name}</span>
              <button type="button" onClick={handleRemoveAttachment}>Remove</button>
            </div>
          )}
        </div>

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
