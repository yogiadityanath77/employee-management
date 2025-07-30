import React, { useState, useEffect } from "react";
import axios from "../api";
import {
  showError,
  showSuccess,
  clearMessages,
  formatValidationErrors,
} from "../utils/errorHandler";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

function EmployeeForm({ editingEmployee, setEditingEmployee, fetchEmployees }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    position: "",
    salary: "",
  });
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        mobile: editingEmployee.mobile,
        email: editingEmployee.email,
        position: editingEmployee.position,
        salary: editingEmployee.salary,
      });
    } else {
      setFormData({
        name: "",
        mobile: "",
        email: "",
        position: "",
        salary: "",
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorDetails([]);
    setSuccess(null);

    try {
      if (editingEmployee) {
        await axios.put(`/api/employees/${editingEmployee._id}`, formData);
        showSuccess("Employee updated successfully!", setSuccess);
      } else {
        await axios.post("/api/employees", formData);
        showSuccess("Employee added successfully!", setSuccess);
      }

      setFormData({
        name: "",
        mobile: "",
        email: "",
        position: "",
        salary: "",
      });
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      showError(err, setError, setErrorDetails);
    } finally {
      setLoading(false);
      clearMessages(setError, setSuccess, 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingEmployee ? "Edit Employee" : "Add Employee"}
      </h2>

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
        {["name", "mobile", "email", "position", "salary"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize text-gray-700">
              {field}
            </label>
            <input
              name={field}
              type={field === "salary" ? "number" : "text"}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Saving..." : editingEmployee ? "Update" : "Add"}
          </button>
          {editingEmployee && (
            <button
              type="button"
              onClick={() => setEditingEmployee(null)}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
