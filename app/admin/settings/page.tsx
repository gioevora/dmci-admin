'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';

import { Breadcrumbs, BreadcrumbItem, Card, CardBody, Listbox, ListboxItem, Button } from "@heroui/react";

import User from './user';
import UserForm from './user-form';
import Certificates from './certificates';

import fetchWithToken from '@/app/utils/fetch-with-token';
import { id, token } from '@/app/utils/storage';
import axios from 'axios';
import toast from 'react-hot-toast';

const breadcrumbLabels: Record<string, string> = {
    account: "Account Settings",
    users: "User List",
    certificates: "Certificates",
    logout: "Log Out",
};


export default function Settings() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("account");
    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
        fetchWithToken,
        {
            refreshInterval: 10000,
        }
    );

    const user = data?.record || "";
    const avatar = data?.record?.profile?.image || "default_image.jpg";

    const handleLogout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            sessionStorage.clear();
            destroyCookie(null, 'token', { path: '/' });
            router.replace('/admin');
        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <section className="py-12 px-4 md:px-12">
            <div className="py-8">
                <div>
                    <h1 className="text-3xl font-bold text-violet-800 uppercase">Settings</h1>
                    <Breadcrumbs isDisabled>
                        <BreadcrumbItem href="/">Home</BreadcrumbItem>
                        <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
                        <BreadcrumbItem isCurrent>{breadcrumbLabels[selectedTab] || "Settings"}</BreadcrumbItem>
                    </Breadcrumbs>
                </div>

                <div className="flex gap-4 py-12">
                    {/* Sidebar Navigation */}
                    <div className="min-w-96 py-2 px-4 flex flex-col border-r border-default-200 dark:border-default-100">
                        <div className="flex items-center gap-4">
                            <img
                                className="w-20 h-20 rounded-full object-cover"
                                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/profiles/${avatar}`}
                            />
                            < div >
                                <h1 className="font-semibold text-xl">{user.name}</h1>
                                <p className="text-tiny text-default-500">{user.email}</p>
                            </div >
                        </div >
                        <div className="py-4 w-full">
                            <Listbox aria-label="Actions" onAction={(key) => setSelectedTab(key as string)}>
                                <ListboxItem key="account">Account</ListboxItem>
                                <ListboxItem key="users">User List</ListboxItem>
                                <ListboxItem key="certificates">Certificates</ListboxItem>
                                <ListboxItem key="logout" className="text-danger" color="danger">
                                    Log Out
                                </ListboxItem>
                            </Listbox>
                        </div>
                    </div >

                    {/* Main Content with Tabs */}
                    < div className="w-full" >

                        {selectedTab === "account" && (
                            <section className='py-2 px-2'>
                                <div className='py-4 flex flex-col gap-4'>
                                    <Card className='shadow-none border'>
                                        <CardBody>
                                            <UserForm />
                                        </CardBody>
                                    </Card>
                                </div>
                            </section>
                        )}
                        {
                            selectedTab === "users" && (
                                <section className='py-2 px-2'>
                                    <h2 className="font-semibold text-lg">Manage Users</h2>
                                    <p>View and manage registered users.</p>
                                    <div className='py-4 flex flex-col gap-4'>
                                        <Card>
                                            <CardBody>
                                                <User />
                                            </CardBody>
                                        </Card>
                                    </div>
                                </section>
                            )
                        }
                        {
                            selectedTab === "certificates" && (
                                <section className='py-2 px-2'>
                                    <div className='py-4 flex flex-col gap-4'>
                                        <h2 className="font-semibold text-lg">Certificates</h2>
                                        <p>Manage and upload certification documents.</p>
                                        <Card>
                                            <CardBody>
                                                <Certificates />
                                            </CardBody>
                                        </Card>
                                    </div>
                                </section>
                            )
                        }
                        {
                            selectedTab === "logout" && (
                                <>
                                    <h2 className="font-semibold text-lg text-danger">Log Out</h2>
                                    <p>Are you sure you want to log out?</p>
                                    <div className="pt-4">
                                        <Button
                                            variant="solid"
                                            color="warning"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </div>

                                </>
                            )
                        }

                    </div >
                </div >
            </div >
        </section >
    );
}
