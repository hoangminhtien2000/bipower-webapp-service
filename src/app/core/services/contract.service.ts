import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CONFIG } from "../config/application.config";
import { UserStorage } from "../storage/user.storage";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: "root",
})
export class ContractService {
    public api = environment.api + '/labor-contract';

    constructor(private http: HttpClient, private userStorage: UserStorage, private translate: TranslateService,
    ) {
    }

    headers = new HttpHeaders()
        .set("Authorization", `Bearer ${this.userStorage.getAccessToken()}`);

    public findById(id: number): Observable<any> {
        return this.http.get<any>(CONFIG.API.CONTRACT.FIND_BY_ID + id);
    }

    public create(formData: any): Observable<any> {
        const req = new HttpRequest('POST', CONFIG.API.CONTRACT.CREATE, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }

    public update(formData: any, id: number): Observable<any> {
        const req = new HttpRequest('POST', CONFIG.API.CONTRACT.UPDATE + id, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }

    public updateStatus(formData: any, id: number): Observable<any> {
        const req = new HttpRequest('POST', CONFIG.API.CONTRACT.UPDATE_HISTORY_STATUS + id, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);
    }

    public getPageSearch(data, listHeaderStatus: any[] = [], listFieldName: any[] = []): Observable<any> {
        let sort = '';
        if (listHeaderStatus.length > 0) {
            sort = '';
            for (let index = 0; index < listHeaderStatus.length; index++) {
                if (listHeaderStatus[index] == null) {
                    continue;
                } else {
                    if (index != 0) {
                        sort += '&';
                    }
                    sort += '';
                    sort += listFieldName[index] + ',' + (listHeaderStatus[index] ? 'asc' : 'desc');
                    if (sort != '') {
                        break;
                    }
                }
            }
        }
        sort = sort ? sort : '';
        return this.http.post<any>(CONFIG.API.CONTRACT.PAGE_SEARCH, {...data}, {
            params: {
                page: data.page,
                size: data.size,
                sort
            }
        });
    }

    getFirstContractData(candidateId): Observable<any> {
        return this.http.get(`${CONFIG.API.CONTRACT.FIRST_CONTRACT_DATA}/${candidateId}`);
    }

    public static listCollaborators = [
        {value: '1', desc: "1 tháng", key: "contract.month.1_month"},
        {value: '2',desc: "2 tháng",key: "contract.month.2_month"},
        {value: '3',desc: "3 tháng",key: "contract.month.3_month"},
        {value: '6',desc: "6 tháng",key: "contract.month.6_month"},
        {value: '12',desc: "12 tháng",key: "contract.month.12_month"},
        {value: '24',desc: "24 tháng",key: "contract.month.24_month"},
        {value: '36',desc: "36 tháng",key: "contract.month.36_month"},
        {value: '60',desc: "60 tháng",key: "contract.month.60_month"},
    ]
    public static listFormal = [
        {value: '12',desc: "12 tháng",key: "contract.month.12_month"},
        {value: '24',desc: "24 tháng",key: "contract.month.24_month"},
        {value: '36',desc: "36 tháng",key: "contract.month.36_month"},
        {value: '60',desc: "60 tháng",key: "contract.month.60_month"},
    ]
    public static listProbation = [
        {value: '1', desc: "1 tháng", key: "contract.month.1_month"},
        {value: '2',desc: "2 tháng",key: "contract.month.2_month"},
        {value: '3',desc: "3 tháng",key: "contract.month.3_month"},
    ]
}
