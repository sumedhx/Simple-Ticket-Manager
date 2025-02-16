import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const credentials = [
  { email: "customer@support.com", password: "customer123" },
  { email: "agent@support.com", password: "agent123" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const firebaseAuth = getAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCredentialSelect = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setShowDropdown(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && (
            <div className="dropdown">
              {credentials.map((cred, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleCredentialSelect(cred)}
                >
                  {cred.email}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <button type="submit">Login</button>
      </form>

      <style>
        {`
          .input-wrapper {
            position: relative;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10;
          }
          .dropdown-item {
            padding: 10px;
            cursor: pointer;
          }
          .dropdown-item:hover {
            background: #f1f1f1;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
