export interface Column<T> {
    key: keyof T; 
    label: string;
    render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    onAction?: (item: T) => void; 
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    actionLabel?: string; 
}

export interface User {
    id: string;
    name: string;
    email: string;
    type: string;
}

export interface Article {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    content: string;
    type: string;
    url: string;
    image: string;
}

export interface Property {
    id: string;
    owner_id: string;
    name: string;
    location: string;
    price: string;
    area: string;
    parking: boolean;
    description: string;
    unit_number: string;
    unit_type: string;
    unit_status: string;
    sale_type: string;
    title: string;
    payment: string;
    turnover: string;
    terms: string;
    status: string;
    badge: string;
    published: number;
    amenities: string;
    images: string;
    create_at: string;
    update_at: string;
    owner: Owner;
    action: string;
    category: string;
}

export interface PropertyRecord {
    record: {
    id: string;
    owner_id: string;
    name: string;
    location: string;
    price: string;
    area: string;
    parking: boolean;
    description: string;
    unit_number: string;
    unit_type: string;
    unit_status: string;
    sale_type: string;
    title: string;
    payment: string;
    turnover: string;
    terms: string;
    status: string;
    badge: string;
    published: number;
    amenities: string;
    images: string;
    create_at: string;
    update_at: string;
    owner: Owner;
    action: string;
    category: string;
    type: string;
    }
}

export interface Owner {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface Partner {
    id: string;
    name: string;
    image: string;
}

export interface Inquiry {
    id: string;
    user_id: string;
    first_name: string;
    last_name:string;
    email:string;
    phone: string;
    type: string;
    properties: string;
    message: string;
    status: string;
    user: User;
}

export interface Career {
    id: string;
    position: string;
    slots: number;
    image: string;
    applications_count: number;
    created_at: string;
    updated_at: string;
    Application: []
}

export interface Application {
    id: string;
    career_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    resume: string;
    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
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
    type: string;
    created_at: string;
    updated_at: string;
}

export interface Schedule {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
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
    user: User;
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
