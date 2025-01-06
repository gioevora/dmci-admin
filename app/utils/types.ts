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

export interface Partner {
    id: string;
    name: string;
    image: string;
}

export interface Testimonial {
    id: number;
    user_id: number;
    name: string;
    message: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Certificate {
    id: number;
    user_id: number;
    name: string;
    date: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface Item {
    id: number;
    name: string;
    image: string;
    width: string;
    height: string;
    category: string;
    created_at: string;
    updated_at: string;
}

export interface Schedule {
    id: number;
    user_id: string;
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    type: string;
    properties: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Submission {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    email: string;
    property: string;
    type: string;
    location: string;
    price: string;
    area: number;
    parking: number;
    vacant: number;
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
    commission: number;
    terms: string;
    title: string;
    turnover: string;
    lease: string;
    acknowledgment: number;
    amenities: string[];
    images: string[];
    created_at: string; 
    updated_at: string; 
}
