import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import * as moment from "moment";
import {Router} from '@angular/router';
import {OnleaveManagementService} from "../../../../../../core/services/onleave-management.service";
import {searchLeaveRequestModel} from "../../../../../../core/models/request/LeaveRequestModel";
import {
    AddOnleaveManagementComponent
} from "../../../../onleave-management/add-onleave-management/add-onleave-management.component";
import {ROLE_LIST} from "../../../../../../core/common/constant";
import {
    initOnsiteRemote,
    searchOnsiteRemoteRequestModel
} from "../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";
import {PresenceService} from "../../../../../../core/services/presence.service";
import {PresenceManagementService} from "../../../../../../core/services/presence-management.service";
import {hasRoles} from "../../../../../../core/helper/role";
import {EmployeeService} from "../../../../../../core";
import {ToastrService} from "ngx-toastr";
import {searchPresenceParamsRequestModel} from "../../../../../../core/models/request/PresenceRequestModel";
import {Subscription} from "rxjs";
import {DataSevice} from "../../../../../../core/services/data.sevice";
import {UserStorage} from "../../../../../../core/storage/user.storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'form-search-onsite-remote',
    templateUrl: './form-search-onsite-remote.component.html',
    styleUrls: ['./form-search-onsite-remote.component.scss']
})
export class FormSearchOnsiteRemoteComponent implements OnInit, OnChanges {
    @Output() searchEvent = new EventEmitter<string>();
    @Input() changePageSize;
    @Input() changePage;
    @Input() params;
    @Input() updateOnsiteRemoteNumber;
    @Input() tabCode: string = "tabEmployee";
    public modalRef: BsModalRef;
    public listOnsiteRemote;
    public date = new Date()
    public currentDate = {
        startDate: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
        endDate: new Date(this.date.getFullYear(), this.date.getMonth()+1, 0)
    };
    public workTypesOnsiteRemote = PresenceManagementService.workTypesOnsiteRemote;
    public statusRegistersOS = PresenceManagementService.statusRegistersOS;
    public statusRegistersOSCOO = PresenceManagementService.statusRegistersOSCOO;
    public currentStatusRegistersOS;
    searchLeave: FormGroup
    teams = [];
    teamId = null;
    fullname: '';
    employeeCode: '';
    currentStatus = "";
    currentTeamId = null;
    removedStatusRegistersOS = null;
    currentWorkType = "";
    status = 'DEFAULT';
    group = 'DEFAULT';
    workType: 'DEFAULT';
    onsiteRemote = initOnsiteRemote();
    subscription: Subscription;
    prams = searchOnsiteRemoteRequestModel(this.currentDate.startDate, this.currentDate.endDate)
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));

    constructor(private _formBuilder: FormBuilder,
                private route: Router,
                private toastrService: ToastrService,
                private employeeSerrvice: EmployeeService,
                public modalService: BsModalService,
                private presenceService: PresenceService,
                private data: DataSevice,
                public userStorage: UserStorage,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        if (this.params) {
            let date = new Date(moment(this.params.date, 'DD/MM/YYYY').year(), moment(this.params.date, 'DD/MM/YYYY').month(), moment(this.params.date, 'DD/MM/YYYY').date());
            this.currentDate = {startDate: date, endDate: date};
        }
        this.initializationForm()
        this.subscription = this.data.currentTabCode.subscribe(tabCode => {
            this.tabCode = tabCode;
            this.prams.isPersonal = this.tabCode == 'tabEmployee';
        })
        this.prams.isPersonal = this.tabCode == 'tabEmployee';
        if (this.prams.isPersonal) {
            this.prams.employeeCode = this.userStorage.getUserInfo().userCode;
        }
        this.callListForTable(this.prams);
        this.fetchTeams();
        this.setStatusRegistersOS();
        this.subscription = this.data.currentTabCode.subscribe(tabCode => this.tabCode = tabCode)
        this.prams.isPersonal = this.tabCode == 'tabEmployee';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onKeypress(event) {
        if(event.keyCode == 13){
            this.searchListOnsiteRemote();
        }
    }

    ngOnChanges() {
        this.prams.page = this.changePage
        if (this.prams.page) {
            this.prams.page = this.prams.page - 1
        }
        this.prams.size = this.changePageSize
        if (this.prams.size === 0) {
            this.prams.size = 10;
        }
        if (this.prams) {
            this.callListForTable(this.prams)
        }
        if (this.updateOnsiteRemoteNumber > 0) {
            this.callListForTable(this.prams)
        }
    }

    fetchTeams() {
        if (this.canSearchByTeams()) {
            this.employeeSerrvice.getTeams().subscribe(res => {
                if (res.success) {
                    this.teams = res.data.teamInfoResps;
                } else {
                    this.toastrService.error(res.message)
                }
            }, error => {
                this.toastrService.error(error.statusText)
            })
        }
    }

    callListForTable(paramsSearch) {
        this.onDateRangePickerChanged()
        this.params? this.params.page = 0 : this.params
        this.presenceService.searchOnsiteRemote(paramsSearch, this.prams).subscribe(res => {
            if (res.success) {
                this.listOnsiteRemote = res.data;
                this.searchEvent.emit(this.listOnsiteRemote);
            }
        })
    }

    initializationForm() {
        this.searchLeave = this._formBuilder.group({
            teamId: ["", [Validators.maxLength(100)]],
            employeeName: ["", [Validators.maxLength(100)]],
            employeeCode: ["", [Validators.maxLength(20)]],
        })
    }

    searchListOnsiteRemote() {
        this.prams.page = 0;
        this.prams.teamId = this.teamId == "null" ? null : this.teamId;
        this.prams.fullname = this.fullname != undefined ? this.fullname.trim() : "";
        this.prams.employeeCode = this.employeeCode != undefined ? this.employeeCode.trim() : "";
        this.prams.status = this.status == 'DEFAULT' ? null : this.status;
        this.prams.workType = this.onsiteRemote.workType == 'DEFAULT' ? null : this.onsiteRemote.workType;
        this.callListForTable(this.prams)
    }

    onClickAdd() {
        this.modalRef = this.modalService.show(AddOnleaveManagementComponent, {
            initialState: {},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false,
        });
        this.modalRef.content.createLeaveEvent.subscribe((leave) => {
            if (leave) {
                this.addNewLeave(leave);
            }
        });
    }

    addNewLeave(leave) {
        this.listOnsiteRemote.content.unshift(leave);
        this.searchEvent.emit(this.listOnsiteRemote);
    }

    onChangeStatus() {
        this.currentStatus = this.status
    }

    onChangeGroup() {
        this.currentTeamId = this.teamId
    }

    onChangeWorkType() {
        this.currentWorkType = this.onsiteRemote.workType
    }

    onClickTable() {
        let url = "/layout/working-onleave-report/list";
        this.route.navigate([url]);
    }

    canSeeLeaveReport() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    blurEmployeeName() {
        this.searchLeave.controls["employeeName"].setValue(this.searchLeave.controls["employeeName"].value ? this.searchLeave.controls["employeeName"].value.trim() : '')
    }

    blurEmployeeCode() {
        this.searchLeave.controls["employeeCode"].setValue(this.searchLeave.controls["employeeCode"].value ? this.searchLeave.controls["employeeCode"].value.trim() : '')
    }

    canSeeGroup() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.COO ||
            role.code == ROLE_LIST.C_B ||
            role.code == ROLE_LIST.PRODUCT_OWNER ||
            role.code == ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    canSeeEmployeeCode() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.COO ||
            role.code == ROLE_LIST.C_B ||
            role.code == ROLE_LIST.PRODUCT_OWNER ||
            role.code == ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    canSeeEmployeeName() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.COO ||
            role.code == ROLE_LIST.C_B ||
            role.code == ROLE_LIST.PRODUCT_OWNER ||
            role.code == ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    canSeeWorkType() {
        return true;
        // let hasPermission = this.roles.filter(role =>
        //     role.code == ROLE_LIST.COO ||
        //     role.code == ROLE_LIST.C_B ||
        //     role.code == ROLE_LIST.PRODUCT_OWNER ||
        //     role.code == ROLE_LIST.TEAM_LEADER
        // );
        // return hasPermission.length > 0;
    }

    canSeeTimeSearch() {
        return true;
        // let hasPermission = this.roles.filter(role =>
        //     role.code == ROLE_LIST.C_B ||
        //     role.code == ROLE_LIST.PRODUCT_OWNER ||
        //     role.code == ROLE_LIST.TEAM_LEADER
        // );
        // return hasPermission.length > 0;
    }

    canSeeStatus() {
        return true;
        // let hasPermission = this.roles.filter(role =>
        //     role.code == ROLE_LIST.C_B ||
        //     role.code == ROLE_LIST.PRODUCT_OWNER ||
        //     role.code == ROLE_LIST.TEAM_LEADER
        // );
        // return hasPermission.length > 0;
    }

    canSearchByTeams() {
        return hasRoles(ROLE_LIST.COO) || hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    onDateRangePickerChanged() {
        this.prams.fromDate = moment(this.currentDate.startDate).format("DD/MM/YYYY")
        this.prams.toDate = moment(this.currentDate.endDate).format("DD/MM/YYYY")
    }

    setStatusRegistersOS() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.COO ||
            role.code == ROLE_LIST.C_B
        );

        if (hasPermission.length > 0) {
            this.currentStatusRegistersOS = this.statusRegistersOSCOO
        } else {
            this.currentStatusRegistersOS = this.statusRegistersOS;
        }
    }
}
