import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Role} from "../../../../core/models/team.model";
import {MemberItem} from "../../containers/team-info/team-info.component";
import {multiSelectRequire} from "../../validators";
import {catchError, debounceTime, filter, map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {BsModalService} from "ngx-bootstrap/modal";
import {TeamService} from "../../../../core/services/team.service";
import {ROLE_LIST} from "../../../../core/common/constant";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-employee-table',
    templateUrl: './employee-table.component.html',
    styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit, OnChanges, OnDestroy {

    @Input() employeeList: MemberItem[] = [];
    @Input() roleList: Role[] = [];
    @Input() po: MemberItem = null;
    @Output() showEmployeeInfo = new EventEmitter<any>();

    page = 1;
    pageSize = 10;

    @Input() editable = false;

    startIndex = 0;
    endIndex = 0;
    searchEmployeeSubject$ = new BehaviorSubject<string>('');
    unsubscribe$ = new Subject<void>();
    memberFormArray: FormArray;
    suggestList: MemberItem[] = [];
    defaultSuggest: MemberItem[] = [];

    constructor(private formGroupDirective: FormGroupDirective,
                private modalService: BsModalService,
                private toastService: ToastrService,
                private translateService: TranslateService,
                private teamService: TeamService) {
    }

    ngOnInit(): void {
        this.memberFormArray = this.formGroupDirective.form.get('employees') as FormArray;
        this.fillDataToForm();
        this.calculatePage();
        this.suggestForEmployee();
        this.memberFormArray.valueChanges.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe(value => this.calculatePage());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['employeeList']) {
            this.fillDataToForm();
        }

        if (changes['page'] || changes['pageSize'] || changes['totalPage']) {
            this.calculatePage();
        }

        if (changes['po'] && this.po) {
            const existedNewPO = this.memberFormArray.controls.some(
                formRow => formRow.value.employeeCode == this.po?.code
            );
            const previousPO = changes['po'].previousValue;
            const index = this.memberFormArray.controls.findIndex(
                formRow => formRow.value.employeeCode == previousPO?.code
            );
            const poRole = this.roleList.find(role => role.code == ROLE_LIST.PRODUCT_OWNER);
            if (existedNewPO) {
                if (previousPO && this.po !== previousPO) {
                    const indexNew = this.memberFormArray.controls.findIndex(
                        formRow => formRow.value.employeeCode == this.po?.code
                    );
                    this.memberFormArray.at(index).patchValue({
                        role: this.memberFormArray.at(index).value.role.filter(role => role.code !== ROLE_LIST.PRODUCT_OWNER)
                    });
                    this.memberFormArray.at(indexNew).patchValue({
                        role: [poRole, ...this.memberFormArray.at(indexNew).value.role]
                    });
                }
                return;
            }
            const hasRolePO = this.po.role.some(role => role.code == ROLE_LIST.PRODUCT_OWNER);
            if (!hasRolePO) {
                this.po = {
                    ...this.po,
                    role: [poRole, ...this.po.role]
                }
            }
            if (index != -1) {
                this.fillRowData(this.memberFormArray.at(index), this.po);
            } else {
                const formPO = this.createFormRow();
                this.fillRowData(formPO, this.po);
                this.memberFormArray.insert(0, formPO);
            }
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    calculatePage(): void {
        this.startIndex = (this.page - 1) * this.pageSize;
        const end = Math.min(this.memberFormArray.length, this.startIndex + this.pageSize) || this.pageSize;
        this.endIndex = end > 0 ? end - 1 : 0;
    }

    changePage(pageNumber: number, pageSize: number): void {
        this.page = pageNumber;
        this.pageSize = pageSize;
        this.calculatePage();
    }

    /**
     * fill data to form array
     */
    fillDataToForm(): void {
        if (this.memberFormArray) {
            this.memberFormArray.clear();
            this.employeeList.forEach(member => {
                const formRow = this.createFormRow(member);
                if (this.isRowPO(formRow)) {
                    this.memberFormArray.push(formRow);
                } else {
                    this.memberFormArray.push(formRow);
                }
            });
            this.getEmployeeList('').pipe(take(1)).subscribe(result => {
                this.defaultSuggest = result;
            });
        }
    }

    /**
     * role serialize
     * @param roles
     */
    roleSerialize(roles: any[]): string {
        if (!roles) {
            return '';
        }
        return roles.map(role => role.name).join(', ');
    }

    /**
     * create form to store employee info
     * @param data
     */
    createFormRow(data?: MemberItem): FormGroup {
        const formRow = new FormGroup({
            name: new FormControl(''),
            autoComplete: new FormControl(null, Validators.required),
            employeeCode: new FormControl(''),
            member_id: new FormControl(''),
            effort_rate: new FormControl(100),
            salary: new FormControl(''),
            productivity: new FormControl(),
            role: new FormControl([], [multiSelectRequire])
        });
        if (data) {
            this.fillRowData(formRow, data);
        }

        formRow.get('role').valueChanges.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe((roles: any[]) => {
            const po = this.formGroupDirective.form.get('po').value;
            const teamLead = this.formGroupDirective.form.get('teamLead').value;
            if (!po) {
                return;
            }
            const newRole = roles.map(role => role.code);
            if (po.id == formRow.get('member_id').value && !newRole.includes(ROLE_LIST.PRODUCT_OWNER)) {
                const poRole = this.roleList.find(role => role.code == ROLE_LIST.PRODUCT_OWNER);
                if (poRole) {
                    formRow.patchValue({role: [poRole, ...roles]}, {emitEvent: false})
                }
            }
            if (teamLead && teamLead.id !== formRow.get('member_id').value) {
                formRow.patchValue({
                    role: roles.filter(role => role.code !== ROLE_LIST.TEAM_LEADER)
                }, {emitEvent: false})
            }
            ;
        });

        // formRow.valueChanges.pipe(
        //     takeUntil(this.unsubscribe$)
        // ).subscribe(rowValue => {
        //     if (this.isRowPO(formRow)) {
        //         formRow.get('role').valueChanges.pipe(
        //             takeUntil(this.unsubscribe$)
        //         ).subscribe((newRoles: any[]) => {
        //             if (!newRoles.map(role => role.code).includes(ROLE_LIST.PRODUCT_OWNER)) {
        //                 const role = this.roleList.find(r => r.code === ROLE_LIST.PRODUCT_OWNER);
        //                 if (role) {
        //                     formRow.patchValue({
        //                         role: [role, ...formRow.get('role').value]
        //                     }, {emitEvent: false})
        //                 }
        //             }
        //         })
        //     }
        // });
        return formRow;
    }

    fillRowData(formRow: AbstractControl, data: any): void {
        formRow.patchValue({
            employeeCode: data.code,
            member_id: data.id,
            name: data.fullName,
            productivity: data.productivity,
            salary: data.salary,
            effort_rate: data.effort_rate,
            role: data.role,
            autoComplete: data
        });
    }

    /**
     * add new empty row
     */
    addRow(): void {
        const newRow = this.createFormRow();
        this.memberFormArray.push(newRow);
    }

    /**
     * remove row
     * @param formRow
     */
    removeRow(formRow: AbstractControl): void {
        if (this.isRowPO(formRow)) {
            return;
        }
        const index = this.memberFormArray.controls.indexOf(formRow);
        if (index != -1) {
            this.memberFormArray.removeAt(index);
        }
    }

    suggestForEmployee(): void {
        this.searchEmployeeSubject$.pipe(
            takeUntil(this.unsubscribe$),
            filter(value => value != null),
            debounceTime(400),
            switchMap(value => this.getEmployeeList(value))
        ).subscribe();
    }

    /**
     * get employees for multiselect option
     * @param value
     */
    getEmployeeList(value: string): Observable<MemberItem[]> {
        const teamType = this.formGroupDirective.form.get('type').value?.code;
        const teamID = this.formGroupDirective.form.get('team_id').value;

        return this.teamService.searchEmployee(value, teamType, teamID).pipe(
            map(response => this.convertSuggestEmployeeData(response)),
            tap(response => {
                this.suggestList = response
                    .filter(el => !this.employeeList.some(e => e.code == el.code));
            }),
            catchError(error => of([]))
        );
    }

    convertSuggestEmployeeData(response: any[]): MemberItem[] {
        if (!response)
            return [];
        return response.map(el => ({
            id: el.id,
            code: el.employeeCode,
            productivity: el.effort,
            salary: el.fullSalary,
            effort_rate: 100,
            role: el.roles?.map(item => {
                const find = this.roleList?.find(r => r.role_id === item.role_id);
                return find ? find : item;
            }) || [],
            chipLabel: this.getCompanyAccount(el.companyEmail),
            display: `${el.employeeCode} - ${el.lastName} ${el.firstName})`,
            fullName: `${el.lastName} ${el.firstName}`
        }));
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

    /**
     * on user select employee
     * @param employee
     * @param formRow
     */
    selectEmployee(employee, formRow: AbstractControl): void {
        const existed = this.memberFormArray.value.some(
            row => row.employeeCode == employee.code
        );
        if (existed) {
            setTimeout(() => formRow.reset());
            this.translateService.get('TEAM.MESSAGE.EMPLOYEE_EXISTED').pipe(
                take(1)
            ).subscribe(message => {
                this.toastService.error(message);
            })
            return;
        }
        const dataFill = {
            ...employee,
            role: this.convertRole(employee.role)
        }
        this.fillRowData(formRow, dataFill);
    }

    /**
     * check row is po or not
     * @param formRow
     */
    isRowPO(formRow: AbstractControl): boolean {
        return this.po && formRow.get('employeeCode').value == this.po?.code;
    }

    emitSearch(e): void {
        const {query} = e;
        this.searchEmployeeSubject$.next(query);
    }

    getRoleOptionForRow(formRow: FormGroup): any[] {
        if (!this.roleList) {
            return [];
        }
        const form = this.formGroupDirective.form;
        const po = form.get('po').value;
        const teamLead = form.get('teamLead').value;
        return this.roleList.filter(role => {
            if (role.code == ROLE_LIST.TEAM_LEADER) {
                return !teamLead || teamLead.id == formRow.get('member_id').value;
            }
            if (role.code == ROLE_LIST.PRODUCT_OWNER) {
                return !po || po.id == formRow.get('member_id').value;
            }
            return true;
        })
    }

    convertRole(role: any[]): any[] {
        if (!role || role.length === 0) {
            return [];
        }
        return role.map(r => {
            const find = this.roleList.find(rl => rl.code === r.code);
            return find || r;
        })
    }

}
