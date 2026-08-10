"use client";
import { useState } from "react";
import UserForm from "@/components/user.form.js";
// import UpdateUser from "@/components/update.user.js";
// import DeleteUser from "@/components/delete.user.js";
import UserTable from "@/components/user.table.js";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshUsers, setRefreshUsers] = useState(0);

  const handleUserChange = () => {
    setRefreshUsers((prev) => prev + 1);
  };

  return (
    <main className="space-y-8 bg-gray-100 p-8">
      <UserForm
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onUserChange={handleUserChange}
      />

      <UserTable onEdit={setSelectedUser} refreshUsers={refreshUsers} />

      {/* <UpdateUser />

      <DeleteUser /> */}
    </main>
  );
}
