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