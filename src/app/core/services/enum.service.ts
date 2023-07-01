import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {throwError, Observable} from "rxjs";
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class EnumStoredService {
    public baseUrlApi = 'http://web.bipower';

    constructor(private http: HttpClient) {
    }

    public getEnum(type: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrlApi}/enum-storeds/${type}`);
    }

    public getEnumByKeys(types: string[]): Observable<any> {
        return this.http.get<any>(`${this.baseUrlApi}/enum-storeds-by-keys/${types}`);
    }

    public getDistrict(): Observable<any> {
        return this.http.get<any>(`https://vapi.vnappmob.com/api/province/`);
    }

    public getProvince(districtId: any): Observable<any> {
        return this.http.get<any>(`https://vapi.vnappmob.com/api/province/district/${districtId}`);
    }

    public getWard(districtId: any): Observable<any> {
        return this.http.get<any>(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
    }

    public getEnumByProvince(): Observable<any> {
        return this.http.get<any>(`https://vapi.vnappmob.com/api/province/`);
    }

    public getEnumByProvinceById(id: string): Observable<any> {
        return this.http.get<any>(`https://vapi.vnappmob.com/api/province/district/${id}`);
    }

    public getAllCountries(): Observable<any> {
        return this.http.get<any>(`https://restcountries.com/v3.1/all/`);
    }

    public getMessageError(errors: any = null, key: string = ''): string {
        let result = '';
        if (errors && errors.error) {
            if (errors.error.message == 'error.validation') {
                for (let item of errors.error?.violations) {
                    result += item['field'] + ': ' + item['message'] + '\n';
                }
            } else {
                if (key) {
                    result = errors.error[key];
                } else {
                    result = errors.error.title;
                }

            }
        }
        return result;
    }

}

/**
 *
 * @param type
 * @returns
 *
 */
export const ENUM = {
    GENDER: "GENDER",//
    POSITION: "POSITION",//
    RELATIONSHIP: "RELATIONSHIP",//
    ROLE_LIST: "ROLE_LIST",// "values": "Developer,QC,Product Owner"
    STACK_LIST: "STACK_LIST",// "values": "Java,Python,Angular JS,Node JS"
    STACK_LEVEL_LIST: "STACK_LEVEL_LIST",// "values": "Intern,Fresher,Junior,Mid Senior,Senior"
    DEGREE_LIST: "DEGREE_LIST",// "values": "TC,DH"
    IDENTITY_CARD_TYPE: "IDENTITY_CARD_TYPE" // CMT,CCCD,PASSPORT
}
