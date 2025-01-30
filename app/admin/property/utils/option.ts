export const fetchWithToken = async (url: string) => {
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

export const agents = [
    { key: "Owner", label: "Owner" },
    { key: "Agent", label: "Agent" },
    { key: "Broker", label: "Broker" },
];

export const agreementMessages: Record<string, string> = {
    Owner: "I agree to provide 1 month full commission when renting out and another 1 month for renewal.",
    Agent: "I agree to a 50/50 commission sharing on the transaction.",
    Broker: "I agree to a 60/40 commission sharing on the transaction.",
};

export const status = [
    { key: "For Rent", label: "For Rent" },
    { key: "For Sale", label: "For Sale" },
];

export const parking = [
    { key: 1, label: "With Parking" },
    { key: 2, label: "No Parking" },
];

export const type = [
    { key: "Studio Type", label: "Studio Type" },
    { key: "1BR", label: "1BR" },
    { key: "2BR", label: "2BR" },
    { key: "3BR", label: "3BR" },
    { key: "Loft", label: "Loft" },
    { key: "Penthouse", label: "Penthouse" },
];

export const furnished = [
    { key: "Bare", label: "Bare" },
    { key: "Semi-Furnished", label: "Semi-Furnished" },
    { key: "Fully-Furnished", label: "Fully-Furnished" },
    { key: "Interiored", label: "Interiored" },
];

export const rent = [
    { key: "6 Months", label: "6 Months" },
    { key: "1 Year", label: "1 Year" },
    { key: "2 Year", label: "2 Years" },
];

export const sale = [
    { key: "RFO", label: "RFO" },
    { key: "Pre-Selling", label: "Pre-Selling" },
];

export const payment = [
    { key: "Cash", label: "Cash" },
    { key: "Bank Financing", label: "Bank Financing" },
];

export const amenities = [
    { key: "Pool Area", label: "Pool Area" },
    { key: "Balcony/Terrace", label: "Balcony/Terrace" },
    { key: "Elevator", label: "Elevator" },
    { key: "Guest Suite", label: "Guest Suite" },
    { key: "Club House", label: "Club House" },
    { key: "Concerierge Services", label: "Concerierge Services" },
    { key: "Underground Parking", label: "Underground Parking" },
    { key: "Gym/Fitnes Center", label: "Gym/Fitnes Center" },
    { key: "Security", label: "Security" },
    { key: "Pet-Friendly Facilities", label: "Pet-Friendly Facilities" },
];