export interface User {
    id: number;
    name: string;
    email: string;
    last_login: string | null;
    status: 'active' | 'blocked';
    created_at: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
}
