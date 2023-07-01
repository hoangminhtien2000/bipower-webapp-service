export interface PageRequest<T> {
    request: T;
    page: {
        page: number;
        page_size: number;
    }
}