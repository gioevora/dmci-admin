// React & React Hooks
import React, { useEffect, useState } from "react";

// External Libraries
import useSWR from "swr";
import axios from "axios";
import toast from "react-hot-toast";

// Component Library
import { Button, Input, Spacer } from "@heroui/react";

// Icons
import { LuPanelBottomClose, LuPencilLine, LuSave } from "react-icons/lu";

// Utils
import fetchWithToken from '@/app/utils/fetch-with-token';
import { id } from '@/app/utils/storage';


// Forms
import ProfileFormCreate from "./profile-form-create";
import ProfileFormUpdate from "./profile-form-update";

const UserForm = () => {
  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, fetchWithToken);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileFormCreate, setProfileFormCreate] = useState(false);
  const [isProfileFormUpdate, setProfileFormUpdate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.record.name || "",
        email: data.record.email || "",
        address: data.record.address || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const formDataToSend = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        formDataToSend.append(key, value);
      }
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("id", `${id}`);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      mutate();
      toast.success("Operation Success!")
      setIsEditing(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase">Personal Information</h1>
        <div className="flex">
          {isEditing && (
            <Button
              variant="solid"
              className="min-w-28 bg-violet-500 text-white"
              startContent={<LuSave />}
              onClick={handleSave}
            >
              Save
            </Button>
          )}
          <Spacer y={2} />
          <Button
            variant="solid"
            className="min-w-28 bg-violet-500 text-white"
            startContent={isEditing ? <LuPanelBottomClose /> : <LuPencilLine />}
            onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
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

      <hr className="border-b border-gray-100" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase">Profile Information</h1>
        <div className="flex">
          {data?.record?.profile === null ? (
            <Button
              variant="solid"
              className="min-w-28 bg-violet-500 text-white"
              startContent={isProfileFormCreate ? <LuPanelBottomClose /> : <LuPencilLine />}
              onClick={() => setProfileFormCreate(!isProfileFormCreate)}
            >
              {isProfileFormCreate ? "Cancel" : "Edit"}
            </Button>
          ) : (
            <Button
              variant="solid"
              className="min-w-28 bg-violet-500 text-white"
              startContent={isProfileFormUpdate ? <LuPanelBottomClose /> : <LuPencilLine />}
              onClick={() => setProfileFormUpdate(!isProfileFormUpdate)}
            >
              {isProfileFormUpdate ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>
      </div>
      {isProfileFormCreate && <ProfileFormCreate id={data.record.id} mutate={mutate} />}
      {isProfileFormUpdate && <ProfileFormUpdate data={data} mutate={mutate} />}
    </div >
  );
};

export default UserForm;