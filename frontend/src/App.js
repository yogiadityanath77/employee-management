import React, { useState, useCallback } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import axios from "./api";
import { showError } from "./utils/errorHandler";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegister, setShowRegister] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get("/api/employees", {
        params: { search, sort, page, limit: 5 },
      });
      setEmployees(res.data.data);
      setTotalPages(res.data.totalPages);
      setError(null);
      setErrorDetails([]);
    } catch (err) {
      showError(err, setError, setErrorDetails);
    }
  }, [search, sort, page]);

  if (!token) {
    return showRegister ? (
      <RegisterForm setShowRegister={setShowRegister} />
    ) : (
      <LoginForm setToken={setToken} setShowRegister={setShowRegister} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
          >
            Logout
          </button>
        </div>

        <ErrorMessage
          error={error}
          details={errorDetails}
          onClose={() => {
            setError(null);
            setErrorDetails([]);
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmployeeForm
            editingEmployee={editingEmployee}
            setEditingEmployee={setEditingEmployee}
            fetchEmployees={fetchEmployees}
          />
          <EmployeeList
            employees={employees}
            setEditingEmployee={setEditingEmployee}
            fetchEmployees={fetchEmployees}
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
