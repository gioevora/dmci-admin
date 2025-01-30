"use client"

import React from "react"
import { Card, CardBody, CardHeader, Divider } from "@heroui/react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Box, Building, Calendar, HelpingHand, Newspaper, Star, User } from "lucide-react"
import useSWR from "swr";
import { FaHelmetSafety } from "react-icons/fa6"
import LoadingDot from "@/components/loading-dot"

const fetchWithToken = async (url: string) => {
    const token = sessionStorage.getItem("token")

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    })

    if (!response.ok) {
        throw new Error("Failed to fetch data")
    }

    return response.json()
}

const barChartData = [
    { name: "Articles", value: 20 },
    { name: "Careers", value: 15 },
    { name: "Properties", value: 30 },
    { name: "Inquiries", value: 25 },
    { name: "Schedules", value: 18 },
]

const pieChartData = [
    { name: "For Sale", value: 400 },
    { name: "For Rent", value: 300 },
    { name: "Sold", value: 200 },
    { name: "Rented", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const Dashboard = () => {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/get-counts`, fetchWithToken)

    if (error) return <LoadingDot />;
    if (isLoading) return <LoadingDot />;

    return (
        <div className="min-h-screen">
            <div className="p-4">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold mb-6 dark:text-white">Dashboard</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <SummaryCard title="Total Properties" value={data.records.properties} icon={<Building />} />
                        <SummaryCard title="New Inquiries" value={data.records.inquiries} icon={<HelpingHand />} />
                        <SummaryCard title="Published Articles" value={data.records.articles} icon={<Newspaper />} />
                        <SummaryCard title="Registered Agent" value="6" icon={<User />} />
                        <SummaryCard title="Careers" value={data.records.careers} icon={<FaHelmetSafety />} />
                        <SummaryCard title="Items" value={data.records.items} icon={<Box />} />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* <Card className="w-full">
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <h4 className="font-bold text-large">Activity Overview</h4>
                                <small className="text-default-500">Monthly summary</small>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card> */}

                        {/* <Card className="w-full">
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <h4 className="font-bold text-large">Property Status</h4>
                                <small className="text-default-500">Distribution</small>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
    <Card className="w-full">
        <CardBody className="flex flex-row items-center justify-between">
            <div>
                <p className="text-sm text-default-500">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
            <div className="text-2xl text-default-400">{icon}</div>
        </CardBody>
    </Card>
)

export default Dashboard

