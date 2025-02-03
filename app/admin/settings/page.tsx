'use client';
import React, { useState } from 'react';
import { Breadcrumbs, BreadcrumbItem, Card, CardBody, Listbox, ListboxItem, Avatar, Input } from "@heroui/react";
import User from './user';
import Profile from './profile';
import Certificates from './certificates';

// Define a mapping for breadcrumb labels
const breadcrumbLabels: Record<string, string> = {
    account: "Account Settings",
    users: "User List",
    certificates: "Certificates",
    logout: "Log Out",
};

export default function Settings() {
    const [selectedTab, setSelectedTab] = useState("account");

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
                            <Avatar
                                className="w-20 h-20 text-large"
                                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                            />
                            <div>
                                <h1 className="font-semibold text-xl">Abic Realty</h1>
                                <p className="text-tiny text-default-500">abicrealtycorporation@gmail.com</p>
                            </div>
                        </div>
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
                    </div>

                    {/* Main Content with Tabs */}
                    <div className="w-full">

                        {selectedTab === "account" && (
                            <section className='py-2 px-2'>
                                <h1 className="font-semibold text-lg">Account Settings</h1>
                                <p>Update your profile information and password.</p>
                                <div className='py-4 flex flex-col gap-4'>
                                    <Card className='shadow-none border'>
                                        <CardBody>
                                            <Profile />
                                        </CardBody>
                                    </Card>

                                    <Card className='shadow-none border'>
                                        <CardBody>
                                            <div className='flex flex-col gap-4'>
                                                <Input
                                                    label="Facebook"
                                                    value={'abicrealty.com'}
                                                />
                                                <Input
                                                    label="Facebook"
                                                    value={'abicrealty.com'}
                                                />
                                            </div>

                                        </CardBody>
                                    </Card>
                                </div>

                            </section>
                        )}
                        {selectedTab === "users" && (
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
                        )}
                        {selectedTab === "certificates" && (
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
                        )}
                        {selectedTab === "logout" && (
                            <>
                                <h2 className="font-semibold text-lg text-danger">Log Out</h2>
                                <p>Are you sure you want to log out?</p>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
