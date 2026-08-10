"use client";

import { useState } from "react";

const listingIds = ["L0101", "L0102", "L0103", "L0104", "L0105"];
const brokerIds = ["B0001", "B0002", "B0003"];
const firmIds = ["F001"];

export default function UpdateUser() {
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [listingId, setListingId] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [firmId, setFirmId] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsLoading(true);

    const payload = {
      type,
      name,
      contact,
      listingId,
      brokerId,
      firmId
    };

    try {
      const response = await fetch(`http://localhost:3000/v1/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      setMessage(result.message);
      setIsSuccess(response.ok);
    } catch (error) {
      setMessage("Unable to connect to server");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl mx-auto max-w-3xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Update User</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            User ID
          </label>

          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full text-gray-400 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-500"
          >
            <option value="">Select type</option>
            <option value="owner">Owner</option>
            <option value="contact-person">Contact Person</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Contact
          </label>

          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter contact"
            className="w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Listing ID
              </label>

              <select
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
                className="w-full text-gray-400 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Listing ID</option>
                {listingIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Broker ID
              </label>

              <select
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                className="w-full text-gray-400 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Broker ID</option>
                {brokerIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Firm ID
              </label>

              <select
                value={firmId}
                onChange={(e) => setFirmId(e.target.value)}
                className="w-full text-gray-400 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Firm ID</option>
                {firmIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
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
          className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}
