"use client"

import React from "react"
import {Card, CardBody} from "@heroui/react"

import { Box, Building,  HelpingHand, Newspaper, User } from "lucide-react"
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

const Dashboard = () => {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/get-counts`, fetchWithToken)

    if (error) return <LoadingDot />;
    if (isLoading) return <LoadingDot />;

    return (
        <section className="py-12 px-4 md:px-12">
            <div className="py-8">
                <div>
                    <h1 className="text-3xl font-bold text-violet-800 uppercase">Dashboard</h1>
                </div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
                    <SummaryCard title="Total Properties" value={data.records.properties} icon={<Building />} />
                    <SummaryCard title="New Inquiries" value={data.records.inquiries} icon={<HelpingHand />} />
                    <SummaryCard title="Published Articles" value={data.records.articles} icon={<Newspaper />} />
                    <SummaryCard title="Registered Agent" value="6" icon={<User />} />
                    <SummaryCard title="Careers" value={data.records.careers} icon={<FaHelmetSafety />} />
                    <SummaryCard title="Items" value={data.records.items} icon={<Box />} />
                </div>
            </div>
        </section>
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

