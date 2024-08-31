export interface Provider {
    id: string;
    name: string;
    email: string;
    city: string;
    phone: string;
    address: string;
}

export interface Product {
    id: string;
    name: string;
    unit: string;
    status: boolean;
}
