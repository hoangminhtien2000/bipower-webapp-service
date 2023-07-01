export interface ApiResponse <T> {
    status?: {
        success?: boolean;
        code?: string;
        message?: string;
        note?: string;
    };
    success?: boolean;
    code?: string;
    message?: string;
    note?: string;
    data?: T;
}

export interface Page<T> {
    count: number;
    items: T[];
}