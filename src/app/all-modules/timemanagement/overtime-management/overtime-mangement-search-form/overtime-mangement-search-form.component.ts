import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TimeManagementService} from 'src/app/core/services/time-management.service';
import {AddOrEditOtManagermentComponent} from "../add-or-edit-ot-managerment/add-or-edit-ot-managerment.component";
import {Router} from '@angular/router';
import * as moment from "moment";
import {ROLE_LIST} from "../../../../core/common/constant";
import {TeamService} from "../../../../core/services/team.service";
import {UserStorage} from "../../../../core/storage/user.storage";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-overtime-mangement-search-form',
    templateUrl: './overtime-mangement-search-form.component.html',
    styleUrls: ['./overtime-mangement-search-form.component.scss']
})
export class OvertimeMangementSearchFormComponent implements OnInit {
    @Output() onSubmit = new EventEmitter<any>();
    @Input() requestCode = '';
    @Input() projectName = '';
    @Input() fullNameSearch = '';
    @Input() overtimeFromAt = '';
    @Input() overtimeToAt = '';
    @Input() department = '';
    public searchOtTime: FormGroup;
    public overtimeStatuses = TimeManagementService.status;
    closedlg: any;
    date = new Date();
    public startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    public endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1,0, 23, 59, 59);
    public modalRef: BsModalRef;
    departmentList: any;
    overtimeStatus: any;
    currentOtStatus = "";
    status = 'DEFAULT';
    roles = this.userStorage.getUserRoles();

    constructor(private _formBuilder: FormBuilder, public modalService: BsModalService,
                private route: Router,
                public timeManagementService: TimeManagementService,
                private toastr: ToastrService,
                private userStorage: UserStorage,
                private teamService: TeamService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.fetchDepartments();
        this.searchOtTime = this._formBuilder.group({
            requestCode: ["", [Validators.maxLength(20)]],
            projectName: ["", [Validators.maxLength(500)]],
            fullNameSearch: ["", [Validators.maxLength(50)]],
            status: [null, []],
            datePicker: [[this.startDate, this.endDate], []],
            department: ["", []],
        });
        this.onClickBtnSearch();
    }

    fetchDepartments() {
        this.teamService.getTeams().subscribe(res => {
            // if (res.success) {
            this.departmentList = res.data;
            // } else {
            //     this.toastr.error(res.message())
            // }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"))
        })
    }

    onChangeStatus() {
        this.currentOtStatus = this.status
    }

    onClickAdd() {
        this.modalRef = this.modalService.show(AddOrEditOtManagermentComponent, {
            initialState: {value: null},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
        });
        if (this.modalRef) {
            (<AddOrEditOtManagermentComponent>this.modalRef.content).result.subscribe((res: any) => {
                if (res.action == "save" || "saveAndApprove" == res.action || "isNew" == res.action) {
                    this.timeManagementService.create(res.data).subscribe(result => {
                        if (result.success) {
                            if (res.action == "isNew") {
                                this.toastr.success(this.translate.instant("timeManager.add_onleave_management.sign_up_success"), this.translate.instant("timeManager.edit_onleave_management.notification"));
                            } else if ("saveAndApprove" == res.action) {
                                this.toastr.success(this.translate.instant("timeManager.list_onleave.submit_approval_successfully"), this.translate.instant("timeManager.edit_onleave_management.notification"));
                            } else {
                                this.toastr.success(this.translate.instant("timeManager.edit_onleave_management.update_success"), this.translate.instant("timeManager.edit_onleave_management.notification"));
                            }
                            this.modalRef.hide();
                            this.onClickBtnSearch();
                        } else {
                            this.toastr.error(result.message)
                        }
                    }, error => {
                        this.toastr.error(error.error?.title)
                    });
                }
            });
        }
    }

    onBlurSearch(fieldName: string) {
        if (this.searchOtTime.value && typeof this.searchOtTime.value[fieldName] == "string") {
            this.searchOtTime.setValue({
                ...this.searchOtTime.value,
                [fieldName]: this.searchOtTime.value[fieldName].trim()
            });
        }
    }

    canSeeSearchDays() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.PRM_LEADER
        );
        return hasPermission.length > 0;
    }

    canSeeSummaryTable() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B ||
            role.code === ROLE_LIST.HRA_LEADER ||
            role.code === ROLE_LIST.CEO ||
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.CFO ||
            role.code === ROLE_LIST.CMO ||
            role.code === ROLE_LIST.CTO
        );
        return hasPermission.length > 0;
    }

    onClickBtnSearch() {
        this.searchOtTime.value.status = this.status == 'DEFAULT' ? null : this.status;
        this.searchOtTime.markAllAsTouched();
        if (this.searchOtTime.valid) {
            let overtimeFromAt = null;
            let overtimeToAt = null;
            if (this.searchOtTime.getRawValue().datePicker) {
                overtimeFromAt = this.convertDateToString(this.startDate);
                overtimeToAt = this.convertDateToString(this.endDate);
                if (this.searchOtTime.getRawValue().datePicker[0]) {
                    overtimeFromAt = moment(this.searchOtTime.getRawValue().datePicker[0]).startOf("day").toDate();
                    overtimeFromAt = this.convertDateToString(overtimeFromAt);
                }
                if (this.searchOtTime.getRawValue().datePicker[1]) {
                    overtimeToAt = moment(this.searchOtTime.getRawValue().datePicker[1]).endOf("day").toDate()
                    overtimeToAt = this.convertDateToString(overtimeToAt);
                }
            }
            let time: any = {};
            if (overtimeFromAt) {
                time.overtimeFromAt = overtimeFromAt;
            }
            if (overtimeToAt) {
                time.overtimeToAt = overtimeToAt;
            }
            this.onSubmit.emit({
                ...this.searchOtTime.value,
                ...time
            });
        } else {
        }
    }

    convertDateToString(date: Date) {
        return moment(date).format("DD/MM/YYYY");
    }

    onClickTable() {
        let url = "/layout/working-overtime-report/list";
        this.route.navigate([url]);
    }

    onKeypress(event) {
        if (event.keyCode == 13) {
            this.onClickBtnSearch();
        }
    }
}
