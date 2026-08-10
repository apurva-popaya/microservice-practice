"use client";

import { useState } from "react";

export default function DeleteUser() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/v1/user/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      setMessage(result.message);
      setIsSuccess(response.ok);

      if (response.ok) {
        setId("");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white mx-auto max-w-3xl p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Delete User
      </h2>

      <form onSubmit={handleDelete} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            User ID
          </label>

          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
          />
        </div>

        {message && (
          <p
            className={`rounded-md p-3 text-sm ${
              isSuccess
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Deleting..." : "Delete User"}
        </button>
      </form>
    </div>
  );
}