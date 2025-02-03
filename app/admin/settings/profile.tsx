import { Input } from "@heroui/react"; // Corrected import
import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col py-6 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" variant="flat" />
        <Input label="Last Name" variant="flat" />
        <Input label="Location" variant="flat" className="col-span-2" />
        <Input label="Last Name" variant="flat" />
        <Input label="Last Name" variant="flat" />
      </div>
    </div>
  );
};

export default Profile;
