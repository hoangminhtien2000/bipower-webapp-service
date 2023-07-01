import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import { CONFIG } from "../config/application.config";

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    constructor(private http: HttpClient) {
    }

    getCatalogs(code: string): Observable<any> {
        return this.http.get<any>(`${CONFIG.API.CATALOG_CODE}${code}`);
    }
}

export const CATALOG_CODE = {
    GENDER: "GENDER",
    EMPLOYEE_POSITION: "APPLY_POSITION",
    EMPLOYEE_STATUS: "EMPLOYEE_STATUS",
    TECHNOLOGY: "TECHNOLOGY",
    EMPLOYEE_IDENTITY_TYPE: "EMPLOYEE_IDENTITY_TYPE",
    EMPLOYEE_RELATIONSHIP: "EMPLOYEE_RELATIONSHIP",
}
