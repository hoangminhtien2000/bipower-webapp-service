import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import {throwError, Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {CONFIG} from "../../core/config/application.config";
import {UserStorage} from "../storage/user.storage";

@Injectable({
    providedIn: "root",
})
export class EmployeeService {
    public api = environment.api + "/employee";
    headers: any = null;
    httpOptions: any = null;

    constructor(private http: HttpClient, private userStorage: UserStorage) {
        this.headers = new HttpHeaders()
            .set("Content-Type", "application/json; charset=utf-8")
        this.httpOptions = {
            headers: this.headers,
        };
    }

    // Handling Errors
    private handleError(error: any) {
        return throwError(error);
    }

    public getPageSearch(body: any, listHeaderStatus: any[] = [], listFieldName: any[] = []): Observable<any> {
        let sort = '';
        if (listHeaderStatus.length > 0) {
            sort = '?';
            for (let index = 0; index < listHeaderStatus.length; index++) {
                if (listHeaderStatus[index] == null) {
                    continue;
                } else {
                    if (index != 0) {
                        sort += '&';
                    }
                    sort += 'sort=';
                    sort += listFieldName[index] + ',' + (listHeaderStatus[index] ? 'asc' : 'desc');
                }
            }
        }

        //fix cung hotfix
        if (sort == '') sort = '?sort=asc';
        return this.http
            .post<any>(CONFIG.API.EMPLOYEE.PAGE_SEARCH + sort, body, this.httpOptions);
    }

    public getExport(body: any): Observable<any> {
        return this.http
            .post<any>(CONFIG.API.EMPLOYEE.EXPORT, body);
    }

    public create(formData: any): Observable<any> {
        const req = new HttpRequest('POST', CONFIG.API.EMPLOYEE.CREATE, formData, {
            reportProgress: true,
            headers: this.headers,
            responseType: 'json'
        });

        return this.http.request(req);
    }

    public update(formData: any, id: number = null): Observable<any> {
        const req = new HttpRequest('POST', CONFIG.API.EMPLOYEE.UPDATE + id, formData, {
            reportProgress: true,
            headers: this.headers,
            responseType: 'json'
        });
        return this.http.request(req);
    }

    public updateCategoryStored(formData: any): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_CATEGORY_STORED, formData, {
            reportProgress: true,
            responseType: 'json'
        });
    }

    public updateBankInfos(formData: any, id: number = 0): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_BANK_INFO, formData, this.httpOptions);
    }

    public updateTaxInfos(formData: any, id: number = 0): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_TAX_INFO, formData, this.httpOptions);
    }

    public updateIdentityInfos(formData: any, id: number = 0): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_IDENTITY_INFO, formData, this.httpOptions);
    }

    public updateFamilyContactInfos(formData: any, id: number = 0): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_FAMILY_CONTRACT, formData, this.httpOptions);
    }

    public updateRelationShip(formData: any, id: number = null): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_RELATION_INFO + id, formData, this.httpOptions);
    }

    public updateStatus(formData: any, id: number = null): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_EMPLOYEE_HISTORY + id, formData, this.httpOptions);
    }

    public getEmployeeScreenCreateContract(): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.GET_TO_CREATE_CONTRACT, null, this.httpOptions);
    }

    public findById(id: number): Observable<any> {
        return this.http.get<any>(`${CONFIG.API.EMPLOYEE.FIND_BY_ID}/${id}`, {headers: this.headers});
    }

    public downloadfile(filePath: string): Observable<any> {
        return this.http.post<any>(`${CONFIG.API.EMPLOYEE.DOWNLOADFILE}`, {filePath});
    }

    public getTemplate(): Observable<any> {
        return this.http.get<any>(`${CONFIG.API.EMPLOYEE.TEMPLATE_DOWNLOAD_FILE}`, {headers: this.headers})
    }


    public getCandidateInfo(code: string): Promise<any> {
        const candidateInfo = {
            employeeCode: "UV001",
            contractTerm: 12,
            contractType: "HDLD",//HDTV, HDLD, HDDV
            negotiableSalary: 210000000,
            contractSalary: 2200000000,
            insuranceSalary: 2300000000,
            netSalary: 240000000,
            probationalSalary: 240000000,
            officialSalary: 250000000,
        };
        //  Mã ứng viên(employeeCode)
        // 	Thời hạn hợp đồng(contractTerm)
        // 	Loại hợp đồng(contractType)
        // 	Mức lương thỏa thuận(negotiableSalary)
        // 	Mức lương đề nghị ký hợp đồng(contractSalary)
        // 	Mức lương đóng bảo hiểm XH(insuranceSalary)
        // 	Mức lương NET(netSalary)
        // 	Mức lương thử việc(probationalSalary)
        // 	Mức lương đề nghị ký hđ chính thức(officialSalary)
        return new Promise((resolve) => {
            resolve({success: true, status: 200, data: candidateInfo});
        })
    }

    import(file): Observable<any> {
        return this.http.post(`${this.api}/import`, file);
    }

    public getTeams(): Observable<any> {
        return this.http.post<any>(`${CONFIG.API.EMPLOYEE.GET_TEAMS}`, {headers: this.headers})
    }

    public getEmployees(): Observable<any> {
        return this.http.post<any>(`${CONFIG.API.EMPLOYEE.GET_EMPLOYEES}`, {headers: this.headers})
    }

    public saveEmployeeSalary(data: any): Observable<any> {
        return this.http.post<any>(`${CONFIG.API.EMPLOYEE.UPDATE_SALARY}`, data)
    }

    public updateTeamByEmployeeId(formData: any): Observable<any> {
        return this.http.post(CONFIG.API.EMPLOYEE.UPDATE_TEAM_BY_EMPLOYEE_ID, formData, this.httpOptions);
    }

    searchEmployeeForSuggest(query: string): Observable<any> {
        return this.http.get(CONFIG.API.EMPLOYEE.SUGGEST_SEARCH, {
            params: {input: query}
        })
    }
}
