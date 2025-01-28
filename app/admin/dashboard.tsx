"use client"

import React from "react"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
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
import { Building, Calendar, HelpingHand, Newspaper, Star, User } from "lucide-react"

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
    return (
        <div className="min-h-screen">
            <div className="p-4">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold mb-6 dark:text-white">Dashboard</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <SummaryCard title="Total Properties" value="1,234" icon={<Building />} />
                        <SummaryCard title="Active Listings" value="567" icon={<Star />} />
                        <SummaryCard title="New Inquiries" value="89" icon={<HelpingHand />} />
                        <SummaryCard title="Scheduled Viewings" value="45" icon={<Calendar />} />
                        <SummaryCard title="Published Articles" value="78" icon={<Newspaper />} />
                        <SummaryCard title="Registered Agenet" value="3,210" icon={<User />} />
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

