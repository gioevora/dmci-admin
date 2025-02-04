import { Button, Input } from "@heroui/react";
import { LuPencilLine, LuSave } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  const token = sessionStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

const Profile = () => {

  const ID = sessionStorage.getItem('id')
  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${ID}`, fetchWithToken);

  console.log(data)

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    dateCreated: "",
    email: "",
    phone: "",
    role: "",
    address: "",
  });


  useEffect(() => {
    if (data) {
      setFormData({
        name: data.record.name || "",
        lastName: data.record.lastName || "",
        dateCreated: data.record.created_at || "",
        email: data.record.email || "",
        phone: data.record.phone || "",
        role: data.record.type || "",
        address: data.record.address || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      mutate();

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase">Personal Information</h1>
        <Button
          variant="solid"
          className="bg-violet-500 text-white"
          startContent={isEditing ? <LuSave /> : <LuPencilLine />}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <hr className="border-b border-gray-100" />

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <p className="text-default-500 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
            {isEditing ? (
              <Input name={key} value={value} onChange={handleChange} />
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
