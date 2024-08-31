export interface TablePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface User {
    id?: string;
    name: string;
    username: string;
    password: string;
    email: string;
    city: string;
    status: boolean;
    role: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    status: string;
}
