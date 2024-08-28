export interface TablePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface User {
    id: string;
    avatar?: string;
    name: string;
    usename: string;
    password: string;
    email: string;
    city: string;
    status: string;
    role: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    status: string;
}
