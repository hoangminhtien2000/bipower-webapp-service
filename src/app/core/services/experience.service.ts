import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class ExperienceService {
    public baseUrlApi = environment.api;

    constructor(private http: HttpClient) { }

    // Handling Errors
    private handleError(error: any) {
        return throwError(error);
    }

    public updateList(body: any): Observable<any>{
      return this.http.post<any>(`${this.baseUrlApi}/update-experiences`, body);
    }
}
