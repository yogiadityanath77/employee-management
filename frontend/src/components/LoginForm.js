import React, { useState } from "react";
import axios from "../api";
import { showError, showSuccess, clearMessages } from "../utils/errorHandler";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

function LoginForm({ setToken, setShowRegister }) {
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
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      showSuccess("Login successful!", setSuccess);
    } catch (err) {
      showError(err, setError, setErrorDetails);
    } finally {
      setLoading(false);
      clearMessages(setError, setSuccess, 3000);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
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
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
