import {Catalog} from "./catalog.model";

export interface Team {
    team_id?: number;
    name?: string;
    team_type_id?: number;
    team_lead_id?: number;
    po_id?: number;
    customers?: string;
    note?: string;
    salary?: string;
    productivity?: number;
    headcount?: number;
    average_productivity?: number;
    create_user_id?: number;
    create_time?: Date;
    last_update_user_id?: number;
    last_update_time?: Date;
    team_type?: Catalog,
    team_lead?: UserData,
    projects?: string;
    po?: UserData;
    create_user?: UserData;
    last_update_user?: UserData;
    domains?: Domain[];
    technologies?: Technology[];
    members?: Member[];
}

export interface SearchTeamRequest {
    name?: string;
    team_type_id?: number;
    technologies?: number[];
    domains?: number[];
}

export interface CreateTeamRequest {
    name: string;
    team_type_id: number;
    note: string;
}


export interface UserData {
    user_id?: number;
    email?: string;
    phone?: string;
    full_name?: string;
}

interface Domain {
    team_domain_id: number;
    domain_id: number;
    domain: Catalog;
}

interface Technology {
    team_technology_id: number;
    technology_id: number;
    technology: Catalog;
    item_id: number;
}

export interface Member {
    team_member_id: number;
    member_id: number;
    salary: number;
    productivity: number;
    member: Employee;
    effort_rate: number;
    offer: any;
    roleMembers: {role_id: number; role: any}[];
}

export interface Employee {
    id: number;
    employeeCode: string;
    fullName: string;
    firstName: string;
    lastName: string;
    gender?: string;
    companyEmail: string;
    phone?: string;
    birthday?: string;
    role?: string,
    roleMember?: {role_id: number; role: any}[];
    numberOfMonthStackExperience?: number;
    cvEnLink?: string;
    cvViLink?: string;
    offer: {
        productivity: number;
        salary: number;
    };
    effort: number;
    fullSalary: number;
    roles: Role[];
}

export interface Role {
    role_id: number;
    code: string;
    name: string;
    note: string;
}

export interface CreateItemRequest {
    catalog_code: string;
    code: string;
    name: string;
}

export interface GetTeamHistoryRequest {
    from_time: any;
    to_time: any;
    team_id: number;
}

export interface TeamHistory {
    action: string;
    action_name: string;
    action_time: string;
    action_user: UserData;
    action_user_id: number;
    audit_id: number;
    create_time: Date;
    last_update_time: Date;
    note: string;
    object_id: number;
    object_type: string;
    team: Team;
    details: {
        action_time: Date;
        audit_detail_id: number;
        audit_id: number;
        column: string;
        column_name: string;
        create_time: Date;
        last_update_time: Date;
        new_value: string;
        old_value: string;
        row_id: number;
        row_key: string;
        table: string;
    } [];
}
