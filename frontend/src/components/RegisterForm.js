import React, { useState } from "react";
import axios from "../api";
import { showError, showSuccess, clearMessages } from "../utils/errorHandler";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

function RegisterForm({ setShowRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorDetails([]);
    setSuccess(null);

    try {
      await axios.post("/api/auth/register", { username, email, password });
      showSuccess("Registration successful! You can now log in.", setSuccess);
      setTimeout(() => {
        setShowRegister(false);
      }, 2000);
    } catch (err) {
      showError(err, setError, setErrorDetails);
    } finally {
      setLoading(false);
      clearMessages(setError, setSuccess, 5000);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Employee Manager
        </h1>

        <ErrorMessage
          error={error}
          details={errorDetails}
          onClose={() => {
            setError(null);
            setErrorDetails([]);
          }}
        />
        <SuccessMessage message={success} onClose={() => setSuccess(null)} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setShowRegister(false)}
            className="text-green-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
