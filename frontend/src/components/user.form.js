"use client";

import { useEffect, useState } from "react";

const listingIds = ["L0101", "L0102", "L0103", "L0104", "L0105"];
const brokerIds = ["B0001", "B0002", "B0003"];
const firmIds = ["F001"];

export default function UserForm({
  selectedUser,
  setSelectedUser,
  onUserChange,
}) {
  const [users, setUsers] = useState({
    owner: {
      name: "",
      contact: "",
    },
    "contact-person": {
      name: "",
      contact: "",
    },
    tenant: {
      name: "",
      contact: "",
    },
  });

  const [listingId, setListingId] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [firmId, setFirmId] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserChange = (type, field, value) => {
    setUsers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    let hasUser = false;

    Object.entries(users).forEach(([type, user]) => {
      const name = user.name.trim();
      const contact = user.contact.trim();

      if (name || contact) {
        hasUser = true;

        newErrors[type] = {};

        if (!name) {
          newErrors[type].name = "Name is required";
        }

        if (!contact) {
          newErrors[type].contact = "Contact is required";
        }
      }
    });

    if (!hasUser) {
      newErrors.general = "At least one user is required";
    }

    if (!listingId) {
      newErrors.listingId = "Listing ID is required";
    }

    if (!brokerId) {
      newErrors.brokerId = "Broker ID is required";
    }

    if (!firmId) {
      newErrors.firmId = "Firm ID is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessage("");
    setErrors({});

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    const data = Object.entries(users)
      .filter(([, user]) => user.name.trim() || user.contact.trim())
      .map(([type, user]) => ({
        type,
        name: user.name.trim(),
        contact: user.contact.trim(),
      }));

    try {
      let response;

      if (editingUserId) {
        const user = data[0];

        response = await fetch(
          `http://localhost:3000/v1/user/${editingUserId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: user.type,
              name: user.name.trim(),
              contact: user.contact.trim(),
              listingId,
              brokerId,
              firmId,
            }),
          },
        );
      } else {
        const payload = {
          data,
          listingId,
          brokerId,
          firmId,
        };

        response = await fetch("http://localhost:3000/v1/users/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      setMessage(result.message);
      setIsSuccess(response.ok);

      if (response.ok) {
        setEditingUserId(null);
        setSelectedUser(null);
        onUserChange();
      }
    } catch (error) {
      setMessage("Unable to connect to server");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setEditingUserId(selectedUser._id);

    setUsers({
      owner: {
        name: selectedUser.type === "owner" ? selectedUser.name : "",
        contact: selectedUser.type === "owner" ? selectedUser.contact : "",
      },

      "contact-person": {
        name: selectedUser.type === "contact-person" ? selectedUser.name : "",
        contact:
          selectedUser.type === "contact-person" ? selectedUser.contact : "",
      },

      tenant: {
        name: selectedUser.type === "tenant" ? selectedUser.name : "",
        contact: selectedUser.type === "tenant" ? selectedUser.contact : "",
      },
    });

    setListingId(selectedUser.listingId || "");
    setBrokerId(selectedUser.brokerId || "");
    setFirmId(selectedUser.firmId || "");
  }, [selectedUser]);

  const userTypes = [
    {
      type: "owner",
      label: "Owner",
    },
    {
      type: "contact-person",
      label: "Contact Person",
    },
    {
      type: "tenant",
      label: "Tenant",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          {editingUserId ? "Update User" : "Add Users"}
        </h1>
        {userTypes.map((userType) => (
          <div key={userType.type} className="mb-8 rounded-lg border p-5">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              {userType.label}
            </h2>

            <div className="grid gap-4 md:grid-cols-1">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={users[userType.type].name}
                  onChange={(e) =>
                    handleUserChange(userType.type, "name", e.target.value)
                  }
                  className="w-full text-gray-800 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                  placeholder="Enter name"
                />

                {errors[userType.type]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[userType.type].name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contact
                </label>

                <input
                  type="text"
                  value={users[userType.type].contact}
                  onChange={(e) =>
                    handleUserChange(userType.type, "contact", e.target.value)
                  }
                  className="w-full text-gray-800 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                  placeholder="Enter contact"
                />
                {errors[userType.type]?.contact && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[userType.type].contact}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="mb-8 rounded-lg border p-5">
          {/* <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Common Details
          </h2> */}

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Listing ID
              </label>

              <select
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
                className="w-full text-gray-700 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Listing ID</option>
                {listingIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>

              {errors.listingId && (
                <p className="mt-1 text-sm text-red-600">{errors.listingId}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Broker ID
              </label>

              <select
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                className="w-full text-gray-700 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Broker ID</option>
                {brokerIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              {errors.brokerId && (
                <p className="mt-1 text-sm text-red-600">{errors.brokerId}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Firm ID
              </label>

              <select
                value={firmId}
                onChange={(e) => setFirmId(e.target.value)}
                className="w-full text-gray-700 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none foucus:border-gray-500"
              >
                <option value="">Select Firm ID</option>
                {firmIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              {errors.firmId && (
                <p className="mt-1 text-sm text-red-600">{errors.firmId}</p>
              )}
            </div>
          </div>
        </div>

        {errors.general && (
          <p className="mb-4 text-sm text-red-600">{errors.general}</p>
        )}

        {message && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              isSuccess
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {Array.isArray(message) ? (
              message.map((msg, index) => <p key={index}>{msg}</p>)
            ) : (
              <p>{message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading
            ? editingUserId
              ? "Updating..."
              : "Saving..."
            : editingUserId
              ? "Update User"
              : "Save"}
        </button>

        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setSelectedUser(null);

              setUsers({
                owner: {
                  name: "",
                  contact: "",
                },
                "contact-person": {
                  name: "",
                  contact: "",
                },
                tenant: {
                  name: "",
                  contact: "",
                },
              });

              setListingId("");
              setBrokerId("");
              setFirmId("");
              setMessage("");
            }}
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
