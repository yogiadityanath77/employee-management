// src/components/EmployeeList.js

import React, { useEffect, useState } from "react";
import axios from "../api";
import { showError, showSuccess } from "../utils/errorHandler";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

function EmployeeList({
  employees,
  setEditingEmployee,
  fetchEmployees,
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
}) {
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await axios.delete(`/api/employees/${id}`);
      showSuccess("Employee deleted successfully!", setSuccess);
      fetchEmployees();
    } catch (err) {
      showError(err, setError, setErrorDetails);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Employees</h2>

      <ErrorMessage
        error={error}
        details={errorDetails}
        onClose={() => {
          setError(null);
          setErrorDetails([]);
        }}
      />
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/2 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="salary">Salary</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Mobile</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Position</th>
              <th className="py-2 px-4 text-left">Salary</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4">{emp.name}</td>
                <td className="py-2 px-4">{emp.mobile}</td>
                <td className="py-2 px-4">{emp.email}</td>
                <td className="py-2 px-4">{emp.position}</td>
                <td className="py-2 px-4">{emp.salary}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => setEditingEmployee(emp)}
                    className="bg-green-600 text-white text-sm px-2 py-1 rounded hover:bg-green-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp._id)}
                    className="bg-red-700 text-white text-sm px-2 py-1 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded ${
              page <= 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded ${
              page >= totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
