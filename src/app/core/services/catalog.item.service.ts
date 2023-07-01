import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import {VerifyService} from "./verify.service";
import {UserStorage} from "../storage/user.storage";
import {CONFIG} from "../config/application.config";
import {CatalogItemAddModel} from "../models/catalog.item.add.model";
import {CreateItemRequest} from "../models/team.model";
import {CATALOG_ITEM} from "../common/constant";

@Injectable({
  providedIn: 'root'
})
export class CatalogItemService {

  constructor(private router: Router, 
              private http: HttpClient,
              public verifyService: VerifyService,
              public userStorage: UserStorage,
              private toastrService: ToastrService){

  }

  getStatusList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_STATUS);
  }

  getApplyPositionList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.APPLY_POSITION);
  }

  getTechnologyList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.TECHNOLOGY);
  }

  getGenderList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_GENDER);
  }

  getSourceList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_SOURCE);
  }

  getCertificateList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_CERTIFICATE);
  }

  getLevelList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_LEVEL);
  }

  getDomainList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_DOMAIN);
  }

  getLiteracyList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_LITERACY);
  }

  getLiteracyEnglishList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_LITERACY_ENGLISH);
  }

  getContactList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_CONTACT);
  }

  getSchoolList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_SCHOOL);
  }

  getMajorsList(itemId: number): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_MAJORS, itemId);
  }

  getContactStatusList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_CONTACT_STATUS);
  }

  getContactStatusAfterList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_STATUS_AFTER_CONTACT);
  }

  getResponseList(): Observable<any> {
    return this.getItems(CATALOG_ITEM.CANDIDATE_RESPONSE);
  }

  addOtherItem(model: CatalogItemAddModel): Observable<any> {
    return this.http.post(CONFIG.API.CATALOG.ADD_ITEM, model);
  }

  getItems(catalogCode: string, parent?: number|null): Observable<any> {
    return this.http.get(CONFIG.API.CATALOG.GET_ITEM, {
      params: {
        catalog_code: catalogCode,
        parent_id: parent || ''
      }
    })
  }

  getItemByCatalog(catalogCode: string): Observable<any> {
    return this.http.get(CONFIG.API.CATALOG.GET_ITEM, {params: {
      catalog_code: catalogCode
      }})
  }

  createItem(request: CreateItemRequest): Observable<any> {
    return this.http.post(CONFIG.API.CATALOG.ADD_ITEM, request);
  }
}
