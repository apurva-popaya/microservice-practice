"use client";

import { useEffect, useState } from "react";

export default function UserTable({ onEdit, refreshUsers }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:3000/v1/users");

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message);
        return;
      }

      setUsers(result.data.data);
    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [refreshUsers]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">Loading users...</div>
    );
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/v1/user/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message);
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      setMessage(result.message);
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Users</h2>

      {message && (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-red-600">{message}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 text-gray-700">Name</th>
              <th className="px-4 py-3 text-gray-700">Type</th>
              <th className="px-4 py-3 text-gray-700">Contact</th>
              <th className="px-4 py-3 text-gray-700">Listing ID</th>
              <th className="px-4 py-3 text-gray-700">Broker ID</th>
              <th className="px-4 py-3 text-gray-700">Firm ID</th>
              <th className="px-4 py-3 text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-3 text-gray-700">{user.name}</td>

                <td className="px-4 py-3 text-gray-700">{user.type}</td>

                <td className="px-4 py-3 text-gray-700">{user.contact}</td>

                <td className="px-4 py-3 text-gray-700">{user.listingId}</td>

                <td className="px-4 py-3 text-gray-700">{user.brokerId}</td>

                <td className="px-4 py-3 text-gray-700">{user.firmId}</td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(user._id)}
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
