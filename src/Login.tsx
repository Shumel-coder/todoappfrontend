import React, { useState } from "react";
import axios from "axios";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://boiling-thicket-60899-05bdfce02845.herokuapp.com/api/auth/login",
        {
          username,
          password,
        }
      );
      onLogin(response.data);
      setError("");
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://boiling-thicket-60899-05bdfce02845.herokuapp.com/api/auth/register",
        {
          username,
          password,
        }
      );
      onLogin(response.data);
      setError("");
    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Login;
