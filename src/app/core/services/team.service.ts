import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse, Page} from "../models/response.model";
import {Catalog} from "../models/catalog.model";
import {environment} from "../../../environments/environment";
import {CONFIG} from "../config/application.config";
import {
    CreateItemRequest,
    CreateTeamRequest,
    Employee,
    GetTeamHistoryRequest,
    Role,
    SearchTeamRequest,
    Team,
    TeamHistory
} from "../models/team.model";
import {PageRequest} from "../models/request.model";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    public api = environment.api;

    public baseUrlApi = environment.api;

    constructor(private http: HttpClient) {
    }

    /**
     * get list type of team
     */
    getTeamTypes(): Observable<ApiResponse<Catalog[]>> {
        return this.http.get<ApiResponse<Catalog[]>>(CONFIG.API.LIST_TEAM_TYPE);
    }

    /**
     * get list technology
     */
    getListTech(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(CONFIG.API.LIST_TECH);
    }

    /**
     * get list domain
     */
    getListDomain(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(CONFIG.API.LIST_DOMAIN);
    }

    /**
     * get list PO
     */
    getEmployeeByRole(role: string): Observable<{ data: Employee[] }> {
        return this.http.get<{ data: Employee[] }>(CONFIG.API.EMPLOYEE_BY_ROLE, {
            params: {role}
        });
    }

    queryEmployee(query: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(CONFIG.API.EMPLOYEE.SUGGEST_EMPLOYEE, {
            params: {
                query: query || ''
            }
        })
    }

    /**
     * get list team
     */
    searchTeam(request: PageRequest<SearchTeamRequest>): Observable<ApiResponse<Page<Team>>> {
        return this.http.post<ApiResponse<Page<Team>>>(CONFIG.API.SEARCH_TEAM, request);
    }

    /**
     * create new team
     * @param request payload
     */
    createTeam(request: CreateTeamRequest): Observable<ApiResponse<Team>> {
        return this.http.post<ApiResponse<Team>>(CONFIG.API.CREATE_TEAM, request);
    }

    /**
     * update team
     */
    updateTeam(request: Team): Observable<ApiResponse<Team>> {
        return this.http.post<ApiResponse<Team>>(CONFIG.API.UPDATE_TEAM, request);
    }

    /**
     * delete team
     */
    deleteTeam(request: Team): Observable<ApiResponse<Team>> {
        return this.http.post<ApiResponse<Team>>(CONFIG.API.DELETE_TEAM, request);
    }

    /**
     * get history request
     * @param request
     */
    getHistory(request: PageRequest<GetTeamHistoryRequest>): Observable<ApiResponse<Page<TeamHistory>>> {
        return this.http.post<ApiResponse<Page<TeamHistory>>>(CONFIG.API.HISTORY_TEAM, request)
    }

    /**
     * get team info
     */
    getTeamInfo(teamId: number): Observable<ApiResponse<Team>> {
        return this.http.get<ApiResponse<Team>>(CONFIG.API.TEAM_INFO, {
            params: {
                team_id: teamId
            }
        });
    }

    /**
     * search employee
     */
    searchEmployee(search: string, teamType: string, teamID: number): Observable<Employee[]> {
        return this.http.get<ApiResponse<any[]>>(CONFIG.API.SEARCH_EMPLOYEE, {
            params: {
                query: search,
                team_type: teamType,
                team_id: 1
            }
        }).pipe(
            map(response => response.data)
        );
    }

    /**
     * get employee info
     * @param employeeID id of employee
     */
    getEmployeeInfo(employeeID: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(CONFIG.API.DETAIL_EMPLOYEE, {
            params: {
                employeeId: employeeID
            }
        })
    }

    /**
     * get list role
     */
    getListRole(): Observable<Role[]> {
        return this.http.get<Role[]>(CONFIG.API.ROLE_LIST);
    }

    /**
     * create item
     */
    createItem(request: CreateItemRequest): Observable<ApiResponse<Catalog>> {
        return this.http.post<ApiResponse<Catalog>>(CONFIG.API.CREATE_ITEM, request);
    }

    getTeams(): Observable<any> {
        return this.http.post<any>(`${this.api}/team/search-team-info-by-timekeeping-req`, {})
    }

}
