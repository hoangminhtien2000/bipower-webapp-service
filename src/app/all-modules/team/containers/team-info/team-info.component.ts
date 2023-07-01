import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, filter, finalize, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {MultiSelect} from "primeng/multiselect";
import {forkJoin, Observable, of, Subject, throwError} from "rxjs";
import {Catalog} from "../../../../core/models/catalog.model";
import {Employee, Role, Team} from "../../../../core/models/team.model";
import {ActivatedRoute} from "@angular/router";
import {multiSelectRequire} from "../../validators";
import {ApiResponse} from "../../../../core/models/response.model";
import {TeamValidator} from "../../team.validator";
import {ToastrService} from "ngx-toastr";
import {TeamChangeHistoryComponent} from "../../components/team-change-history/team-change-history.component";
import {EmployeeInfoDialogComponent} from "../../components/employee-info-dialog/employee-info-dialog.component";
import {CatalogItemService} from "../../../../core/services/catalog.item.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {CreateItemDialogComponent} from "../../components/create-item-dialog/create-item-dialog.component";
import {ConfirmSaveDialogComponent} from "../../components/confirm-save-dialog/confirm-save-dialog.component";
import {ConfirmExitPageComponent} from "../../components/confirm-exit-page/confirm-exit-page.component";
import {CONFIG} from "../../../../core/config/application.config";
import {TeamService} from "../../../../core/services/team.service";
import {EmployeeService} from "../../../../core";

declare const $;
export declare type CatalogCode = 'TECHNOLOGY' | 'CANDIDATE_DOMAIN';

export interface MemberItem {
    id: number;
    code: string;
    productivity: number;
    salary: number;
    chipLabel: string;
    display: string;
    effort_rate: number;
    role: any[];
    fullName: string;
}

@Component({
    selector: 'app-team-info',
    templateUrl: './team-info.component.html',
    styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit, OnDestroy {

    readonly idEmployeeInfoModal = 'modal_employee_info';

    @ViewChild('domainSelect', {static: false}) domainSelect: MultiSelect;
    @ViewChild('techSelect', {static: false}) techSelect: MultiSelect;
    @ViewChild('ct', {static: false}) employeeSelect: any;
    @ViewChild(TeamChangeHistoryComponent, {static: true}) historyModal: TeamChangeHistoryComponent;
    @ViewChild(EmployeeInfoDialogComponent, {static: true}) employeeModal: EmployeeInfoDialogComponent;

    teamInfo: Team;
    formTeam: FormGroup;
    canExit = true;
    canEdit = false;
    canViewHistory = false;
    loading = false;
    isProduction: boolean = true;
    unsubscribe$ = new Subject<void>();

    teamTypeOption: Catalog[] = [];
    domainOptions: Catalog[];
    techOptions: Catalog[];
    POOptions: Employee[];
    teamLeadOptions: Employee[] = [];
    employeeOptions: MemberItem[] = [];
    roleList: Role[] = [];

    employeeSelected: number;
    poSelected: MemberItem;
    employeeList: MemberItem[] = [];
    catalogCode: CatalogCode;

    employeePagination = {
        page: 1,
        pageSize: 10
    }

    constructor(private teamService: TeamService,
                private modalService: BsModalService,
                private catalogService: CatalogItemService,
                private formBuilder: FormBuilder,
                private teamValidator: TeamValidator,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.initForm();
        this.updateFormValidator();
        this.loading = true;
        forkJoin([
            this.getListTech(),
            this.getListDomain(),
            this.getListPO(),
            this.getTeamTypes(),
            this.getListRole(),
            this.getListTeamLead(),
            this.getTeamInfo(),
        ]).pipe(take(1),
            finalize(() => this.loading = false)).subscribe(data => {
            if (this.teamInfo) {
                this.fillDataToForm(this.teamInfo)
            }
        });
        this.formTeam.get('po').valueChanges.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(po => {
            const poItem: MemberItem = po ? {
                id: po?.id,
                code: po?.employeeCode,
                role: this.convertRoles(po?.roles),
                effort_rate: 100,
                display: `${po.lastName} ${po.firstName}`,
                productivity: po.effort || 0,
                salary: po.fullSalary || 0,
                fullName: `${po.lastName} ${po.firstName}`,
                chipLabel: this.getCompanyAccount(po.companyEmail)
            } : null;
            this.poSelected = poItem;
        });
        this.canEdit = this.teamValidator.validatePermission(
            CONFIG.PERMISSION.ACTION.EDIT_TEAM, false
        );
        this.canViewHistory = this.teamValidator.validatePermission(
            CONFIG.PERMISSION.ACTION.VIEW_TEAM_HISTORY, false
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    initForm(): void {
        this.formTeam = this.formBuilder.group({
            team_id: new FormControl('', Validators.required),
            name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            type: new FormControl('', Validators.required),
            po: new FormControl('', Validators.required),
            teamLead: new FormControl('', Validators.required),
            domain: new FormControl([], multiSelectRequire),
            tech: new FormControl([], multiSelectRequire),
            project: new FormControl('', Validators.maxLength(500)),
            customer: new FormControl('', Validators.maxLength(500)),
            description: new FormControl('', Validators.maxLength(500)),
            employees: new FormArray([])
        });
        const canEditName = this.teamValidator.validateRole(CONFIG.ROLE.ACTION.EDIT_TEAM_NAME);
        if (!canEditName) {
            this.formTeam.get('name').disable();
        }
        this.formTeam.get('type').disable();
        this.formTeam.markAsTouched();
    }

    groupTech(): void {
        const currentTech = this.formTeam.get('tech').value as Catalog[];
        this.techOptions = [
            ...currentTech,
            ...this.techOptions.filter(option => !currentTech.some(t => t.item_id == option.item_id))];
    }

    groupDomain(): void {
        const currentDomain = this.formTeam.get('domain').value as Catalog[];
        this.domainOptions = [...currentDomain, ...this.domainOptions.filter(option => !currentDomain.some(d => d.item_id == option.item_id))];
    }

    /**
     * handle submit form
     */
    submitForm(): void {
        const {valid} = this.formTeam;
        if (!valid) {
            this.formTeam.markAllAsTouched();
            const errorEl = document.querySelectorAll('.ng-invalid.ng-touched');
            this.employeeSelect.control.markAsTouched();
            errorEl[0]?.scrollIntoView({behavior: 'smooth'});
            return;
        }
        const value = this.formTeam.getRawValue();
        const request = {
            team_id: value.team_id,
            name: value.name,
            team_type_id: value.type.item_id,
            team_lead_id: value.teamLead.id,
            po_id: value.po?.id || null,
            projects: value.project,
            customers: value.customer,
            note: value.description,
            domains: value.domain.map(el => ({domain_id: el.item_id})),
            technologies: value.tech.map(el => ({technology_id: el.item_id})),
            members: value.employees.map(el => ({
                member_id: el.member_id,
                effort_rate: el.effort_rate,
                roles: el.role.map(roleItem => roleItem.role_id)
            }))
        }
        this.loading = true;
        this.teamService.updateTeam(request).pipe(
            take(1),
            tap(updateResponse => {
                this.toastService.success(updateResponse.status.message);
            }),
            switchMap(res => this.getTeamInfo()),
            finalize(() => this.loading = false),
            catchError(error => {
                this.teamValidator.handleResponseError(error);
                return throwError(error);
            })

        ).subscribe(response => {
            this.fillDataToForm(response.data);
            setTimeout(() => this.canExit = true);

        });
    }

    /**
     * update validator for form
     */
    updateFormValidator(): void {
        this.formTeam.get('type').valueChanges.pipe(
            takeUntil(this.unsubscribe$),
            filter(value => !!value)
        ).subscribe(value => {
            this.isProduction = value.code === 'PRODUCTION';
            if (this.isProduction) {
                this.formTeam.get('po').setValidators([Validators.required]);
                this.formTeam.get('domain').setValidators([multiSelectRequire]);
                this.formTeam.get('tech').setValidators([multiSelectRequire])
            } else {
                this.formTeam.get('po').clearValidators();
                this.formTeam.get('domain').clearValidators();
                this.formTeam.get('tech').clearValidators();
            }
            this.formTeam.get('po').updateValueAndValidity();
            this.formTeam.get('domain').updateValueAndValidity();
            this.formTeam.get('tech').updateValueAndValidity();
        })
    }

    /**
     * get team info
     */
    getTeamInfo(): Observable<ApiResponse<Team>> {
        const teamId = this.activatedRoute.snapshot.paramMap.get('id');
        if (!teamId) {
            return of(null)
        }
        return this.teamService.getTeamInfo(Number(teamId)).pipe(
            take(1),
            tap(response => this.teamInfo = response.data),
            catchError(error => of(null))
        );
    }

    /**
     * fill data to form
     * @param team data to fill
     */
    fillDataToForm(team: Team): void {
        // mapping data from api info to options
        const teamType = this.teamTypeOption.find(option => option.item_id === this.teamInfo.team_type_id) || this.teamInfo.team_type;
        const techs = this.teamInfo.technologies.map(el => {
            const find = this.techOptions?.find(tech => {
                return tech.item_id === el.technology.item_id;
            });
            return find ? find : el.technology
        });

        const domains = this.teamInfo.domains.map(domain => {
            const find = this.domainOptions?.find(option => option.item_id === domain.domain.item_id);
            return find ? find : domain.domain
        });
        const lead = this.teamLeadOptions?.find(option => option.id === this.teamInfo.team_lead_id) || null;
        const po = this.POOptions?.find(option => option.id === this.teamInfo.po_id) || null;

        // fill data
        this.formTeam.patchValue({
            team_id: team.team_id,
            name: team.name,
            type: teamType,
            po: po,
            teamLead: lead,
            domain: domains,
            tech: techs,
            project: team.projects,
            customer: team.customers,
            description: team.note,
        });
        this.employeeList = this.teamInfo.members.map(el => ({
            id: el.member.id,
            code: el.member.employeeCode,
            productivity: el.member?.effort,
            salary: el.member?.fullSalary,
            role: el.roleMembers.map(role => {
                const find = this.roleList.find(el => el.role_id === role.role_id);
                return find ? find : role;
            }),
            fullName: `${el?.member?.lastName} ${el?.member?.firstName}`,
            effort_rate: el.effort_rate,
            chipLabel: el?.member?.companyEmail.match(/^([^@]*)@/)[1],
            display: `${this.getCompanyAccount(el?.member?.companyEmail)} - ${el?.member?.lastName} ${el?.member?.firstName}`
        }));

        setTimeout(() => {
            this.formTeam.valueChanges.pipe(
                takeUntil(this.unsubscribe$),
            ).subscribe(value => {
                this.canExit = false;
            })
        });
    }

    /**
     * get list type of team
     */
    getTeamTypes(): Observable<ApiResponse<Catalog[]>> {
        return this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.TEAM_TYPE).pipe(
            take(1),
            tap(response => this.teamTypeOption = response.data),
            catchError(error => of(null))
        );
    }

    /**
     * get list po
     */
    getListPO(query: string = null): Observable<ApiResponse<any>> {
        return this.teamService.queryEmployee(query).pipe(
            tap(response => this.POOptions = response.data.map(el => ({
                ...el,
                display: `${el.employeeCode} - ${el.lastName} ${el.firstName}`
            }))),
            catchError(error => of(null))
        )
        // return this.teamService.getEmployeeByRole(CONFIG.ROLES.PO).pipe(
        //     tap(response => this.POOptions = response.data.map(el => ({
        //         ...el, display: `${el.companyEmail.match(/^([^@]*)@/)[1]} (${el.lastName} ${el.firstName})`
        //     }))),
        //     catchError(error => of(null))
        // );
    }

    /**
     * get list team list
     */
    getListTeamLead(query = null): Observable<{ data: Employee[] }> {
        return this.teamService.queryEmployee(query).pipe(
            tap(response => this.teamLeadOptions = response.data.map(el => ({
                ...el,
                display: `${el.employeeCode} - ${el.lastName} ${el.firstName}`
            }))),
            catchError(error => of(null))
        )
        // return this.teamService.getEmployeeByRole(CONFIG.ROLES.TEAM_LEAD).pipe(
        //     tap(response => this.teamLeadOptions = response.data.map(el => ({
        //         ...el,
        //         display: `${el.companyEmail.match(/^([^@]*)@/)[1]} (${el.lastName} ${el.firstName})`
        //     }))),
        //     catchError(error => of(null))
        // );
    }

    /**
     * get list domain
     */
    getListDomain(): Observable<ApiResponse<any>> {
        return this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.CANDIDATE_DOMAIN).pipe(
            take(1),
            tap(response => this.domainOptions = response.data),
            catchError(error => of(null))
        );
    }

    /**
     * get list tech
     */
    getListTech(): Observable<ApiResponse<any>> {
        return this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.TECHNOLOGY).pipe(
            take(1),
            tap(response => this.techOptions = response.data),
            catchError(() => of(null))
        );
    }

    /**
     * get list role
     */
    getListRole(): Observable<any> {
        return this.teamService.getListRole().pipe(
            take(1),
            tap(response => this.roleList = response),
            catchError(() => of(null))
        );
    }

    /**
     * get employees for multiselect option
     * @param value
     */
    getEmployeeList(value: string): Observable<Employee[]> {
        const teamType = this.formTeam.get('type').value?.code;
        const teamID = this.teamInfo.team_id;
        return this.teamService.searchEmployee(value, teamType, teamID).pipe(
            tap((response: any[]) => {
                this.employeeOptions = this.convertSuggestEmployeeData(response)
                    .filter(el => !this.employeeList.some(e => e.code == el.code));
            }),
            catchError(error => of([]))
        );
    }

    /**
     * handle when item saved success
     * @param item
     */
    onItemCreateSuccess(item: Catalog): void {
        if (this.catalogCode === 'CANDIDATE_DOMAIN') {
            this.domainOptions = [item, ...this.domainOptions];
            this.formTeam.get('domain').patchValue([...this.formTeam.get('domain').value, item])
            this.domainSelect?.show();
        }
        if (this.catalogCode === 'TECHNOLOGY') {
            this.techOptions = [item, ...this.techOptions];
            this.formTeam.get('tech').patchValue([...this.formTeam.get('tech').value, item])
            this.techSelect?.show();
        }
    }

    toggleAllEmployee(checked: boolean): void {
        if (!checked) {
            this.employeeList = [];
        }
    }

    /**
     * handle pagination change
     * @param page
     * @param pageSize
     */
    changePage(page: number, pageSize: number): void {
        this.employeePagination = {
            page, pageSize
        }
    }

    /**
     * open team history dialog
     */
    openHistoryDialog(): void {
        this.modalService.show(TeamChangeHistoryComponent, {
            initialState: {teamId: this.teamInfo.team_id},
            class: 'modal-left modal-dialog-centered w-70 max-width-modal expand',
            ignoreBackdropClick: true
        })
    }

    openConfirmSave(): void {
        const {valid} = this.formTeam;
        if (!valid) {
            this.formTeam.markAllAsTouched();
            setTimeout(() => {
                const errorEl = document.querySelectorAll('.ng-invalid.ng-touched');
                errorEl[1]?.scrollIntoView({behavior: 'smooth', block: 'center'});
            });
            Object.keys(this.formTeam.controls).forEach(key => {
                if (this.formTeam.get(key).invalid) {
                }
            })
            return;
        }
        // $(`#${this.idConfirmSaveModal}`).modal('show');
        const ref = this.modalService.show(ConfirmSaveDialogComponent, {
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        ref.content.confirmSubject$.pipe(
            filter(val => !!val),
            take(1)
        ).subscribe(confirm => {
            this.executeSave(confirm);
        })
    }

    /**
     * open employee info dialog
     */
    openEmployeeInfoDialog(event: any): void {
        if (!this.teamValidator.validatePermission(CONFIG.PERMISSION.ACTION.SHOW_EMPLOYEE_INFO)) {
            return;
        }
        this.employeeSelected = Number(event.member_id);
        this.modalService.show(EmployeeInfoDialogComponent, {
            initialState: {employeeID: this.employeeSelected},
            class: 'modal-left modal-dialog-centered w-90 max-width-modal expand',
            ignoreBackdropClick: true
        })
    }

    /**
     * open dialog to add new item (trigger when click 'other' option)
     * @param catalog_code
     */
    openCreateTechDialog(catalog_code: CatalogCode): void {
        this.catalogCode = catalog_code;
        const ref = this.modalService.show(CreateItemDialogComponent, {
            initialState: {catalog_code: catalog_code},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        })
        ref.content.itemSubject.pipe(
            filter(value => !!value),
            take(1)
        ).subscribe(value => {
            this.onItemCreateSuccess(value);
            ref.hide();
        })
        setTimeout(() => {
            this.techSelect.hide();
            this.domainSelect.hide();
        });
    }

    confirmExit(): any {
        const ref = this.modalService.show(ConfirmExitPageComponent, {
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        return ref.content.confirmSubject$.pipe(
            filter(value => value !== null)
        );
    }

    /**
     * handle when user confirm save
     * @param result is user confirm
     */
    executeSave(result): void {
        if (result) {
            this.submitForm();
        }
    }

    /**
     * get company account
     * @param companyEmail
     */
    getCompanyAccount(companyEmail: string): string {
        try {
            return companyEmail.match(/^([^@]*)@/)[1];
        } catch (e) {
            return companyEmail;
        }
    }

    convertRoles(role: any[]): any[] {
        if (!role || role.length == 0) {
            return [];
        }
        return role.map(r => {
            const find = this.roleList.find(rl => rl.code === r.code);
            return find || r;
        })
    }

    convertSuggestEmployeeData(response: any[]): MemberItem[] {
        if (!response)
            return [];
        return response.map(el => ({
            id: el.id,
            code: el.employeeCode,
            productivity: el.offer?.productivity,
            salary: el.offer?.salary,
            effort_rate: 100,
            role: el.roles?.map(item => {
                const find = this.roleList?.find(r => r.role_id === item.role_id);
                return find ? find : item;
            }) || [],
            chipLabel: this.getCompanyAccount(el.companyEmail),
            display: `${this.getCompanyAccount(el.companyEmail)} (${el.lastName} ${el.firstName})`,
            fullName: `${el.lastName} ${el.firstName}`
        }));
    }

    /**
     *
     * @param itemArray
     */
    serializeItemArrayData(itemArray: any[]): string {
        if (!itemArray) {
            return '';
        }
        return itemArray.map(item => item.name).join(', ');
    }

}
