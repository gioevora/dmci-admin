import useSWR from "swr";
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

const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/get-counts`, fetchWithToken)
