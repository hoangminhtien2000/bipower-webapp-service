import { EmployeeModel } from "./employee/employee.model";

export interface ReviewCVResult {
    id: number;
    reviewer_id: number;
    reviewer_status: boolean;
    note: string;
    review_time: Date;
    reviewer: EmployeeModel;
}
