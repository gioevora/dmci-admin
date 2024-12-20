import { ReactNode } from 'react';

export interface Column<T> {
    key: keyof T; 
    label: string;
    render?: (item: T) => ReactNode; 
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    onAction?: (item: T) => void; 
    actionLabel?: string; 
}

export interface Property {
    id: number;
    name: string;
    logo: string;
    slogan: string;
    description: string;
    location: string;
    min_price: string;
    max_price: string;
    status: string;
    percent: string;
    images: string;
}

export interface Schedule {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    email: string;
    date: Date;
    time: string;
    type: string;
    properties: string;
    message: string;
    status: string;
}
export interface Submissions {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    email: string;
    property: string;
    type: string;
    location: string;
    price: number;
    area: number;
    parking: boolean;
    vacant: boolean;
    nearby: string;
    description: string;
    sale: string;
    badge: string;
    status: string;
    submit_status: string;
    unit_number: string;
    unit_type: string;
    unit_furnish: string;
    unit_floor: string;
    submitted_by: string;
    commission: boolean;
    terms: string;
    title: string;
    turnover: string;
    lease: string;
    acknowledgment: boolean;
    
    // Change amenities and images to arrays
    amenities: string[]; // Array of strings
    images: string[]; // Array of strings
}
