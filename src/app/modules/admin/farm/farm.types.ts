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

export interface ProductType {
    id: string;
    name: string;
}

export interface Stage {
    id: string;
    name: string;
}

export interface Farm {
    id: string;
    name: string;
    province: string;
    city: string;
    phone: string;
    address: string;
}

export interface Order {
    id: string;
    farm: string;
    stage: string;
    date: string;
    quantity: string;
}
