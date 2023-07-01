import { RoleResponseI } from "./oauth.response.model";

export interface TeamInfoI{
    id: number,
    teamName: string,
    teamType: string,
    productOwnerEmpId?: string,
    teamLeaderEmpId?: string,
    memberIds?: number[]
}

export interface TeamResponseI{
    success: Boolean,
    message: string,
    data?: TeamInfoI[]
}

export interface EmployeeConfirmI {
    isApproval: Boolean,
    note?: string,
}

export interface TeamRoleInfoI {
    team?: TeamInfoI,
    role?: RoleResponseI
}