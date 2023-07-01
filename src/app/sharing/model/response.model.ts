export interface ApiResponse <T> {
    status?: any;
    success?: boolean;
    code?: string;
    message?: string;
    note?: string;
    data: T;
}

export interface Page<T> {
    count: number;
    items: T[];
}
