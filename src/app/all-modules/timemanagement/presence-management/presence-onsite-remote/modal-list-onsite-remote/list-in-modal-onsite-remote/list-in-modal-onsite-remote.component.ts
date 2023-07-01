import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ROLE_LIST} from "../../../../../../core/common/constant";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {userToken} from "../../../../../../core/interfaces/userToken";
import jwt_decode from "jwt-decode";
import {ToastrService} from "ngx-toastr";
import {Constant} from "../../../../../../core/helper/leave/constants";
import {Constant as ConstantPresence} from "../../../../../../core/helper/presence/constants";
import {SendApprovalMultilOsComponent} from "./send-approval-multil-os/send-approval-multil-os.component";
import {ApprovalMultilOsComponent} from "./approval-multil-os/approval-multil-os.component";
import {UnapprovalMultilOsComponent} from "./unapproval-multil-os/unapproval-multil-os.component";
import {ModalUpdateOnsiteRemoteComponent} from "./modal-update-onsite-remote/modal-update-onsite-remote.component";
import {UserStorage} from "../../../../../../core/storage/user.storage";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'list-in-modal-onsite-remote',
    templateUrl: './list-in-modal-onsite-remote.component.html',
    styleUrls: ['./list-in-modal-onsite-remote.component.scss']
})
export class ListInModalOnsiteRemoteComponent implements OnChanges {
    @Input() params;
    autoOpenedOnsiteRemoteDetailModal = false;
    @Input() listOnsiteRemote;
    @Input() modalUpdateOnsiteRemoteComponent;
    @Input() paginationInfor;
    @Output() pageEvent = new EventEmitter<any>()
    @Output() pageChangeEvent = new EventEmitter<any>()
    @Output() updateOnsiteRemoteEvent = new EventEmitter<any>()
    pageIndex = 0;
    public modalRef: BsModalRef;
    public checkAll: boolean = false;
    public isHiddenBtn: boolean = false;
    statusArray = ConstantPresence.PRESENCE_STATUS_ARRAY;
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    user: userToken = jwt_decode(localStorage.getItem('access_token'));

    constructor(public modalService: BsModalService,
                public toastrService: ToastrService,
                public userStorage: UserStorage,
                private translate: TranslateService
    ) {
    }

    ngOnChanges(): void {
    }

    pageChange(pageIndex: number): void {
        this.paginationInfor.number = pageIndex;
        if(this.paginationInfor.pageSize == undefined) this.paginationInfor.pageSize = 10;
        this.pageChangeEvent.emit(this.paginationInfor.number)
    }

    get isHidden() {
        return this.paginationInfor?.totalElements > 0;
    }

    onChangePageSize(page): void {
        this.paginationInfor.pageSize = parseInt(page);
        this.pageEvent.emit(this.paginationInfor.pageSize)
    }

    onClickAllCheckBox(event) {
        let flag = !!event.target.checked;
        for (let index = 0; index < this.listOnsiteRemote.length; index++) {
            const item = this.listOnsiteRemote[index];
            if (this.disabledCheckBox(item)) continue;
            item.checked = flag;
        }
    }

    onClickCheckBox(onsiteRemote: any) {
        const finder = this.listOnsiteRemote.find(el => el.id == onsiteRemote.id);
        finder.checked = !finder.checked;
        this.checkAll = this.listOnsiteRemote.filter(this.filterList()).length == this.listOnsiteRemote.filter(el => this.disabledCheckBox(el) != true).length;
    }

    filterList() {
        return el => el.checked == true && el.isDisabled != true;
    }

    showUpdateOnsiteRemoteModal(onsiteRemote, isDisabledCheckBox) {
        this.autoOpenedOnsiteRemoteDetailModal = true;
        this.modalRef = this.modalService.show(ModalUpdateOnsiteRemoteComponent, {
            initialState:
                {
                    osRefModal: {
                        id: onsiteRemote.id,
                        teamName: onsiteRemote.teamName,
                        fullName: onsiteRemote.fullname,
                        fromTime: onsiteRemote.fromTime,
                        toTime: onsiteRemote.toTime,
                        reason: onsiteRemote.reason,
                        requestWorkOutsideStatus: onsiteRemote.requestWorkOutsideStatus,
                        workType: onsiteRemote.workType,
                        workingLocation: onsiteRemote.workingLocation,
                        projectName: onsiteRemote.projectName,
                        employeeCode: onsiteRemote.employeeCode,
                    },
                    isDisabledCheckBox : isDisabledCheckBox
                },
            class: 'modal-left modal-dialog-centered w-45 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });
        this.modalRef.content.modalUpdateOnsiteRemoteComponent.subscribe((status) => {
            if (status) {
                this.updatePresence();
            }
        });
    }

    updatePresence() {
        this.updateOnsiteRemoteEvent.emit(true);
    }

    showMultilUnApprovalModal() {
        if (this.getSelectedLeaveIds().length == 0) {
            this.toastrService.warning('Danh sách dữ liệu bị rỗng!')
            return;
        }

        this.modalRef = this.modalService.show(UnapprovalMultilOsComponent, {
            initialState:
                {
                    selectedLeaveIds: this.getSelectedLeaveIds()
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.unApprovalMultilEvent.subscribe((status) => {
            if (status) {
                this.updatePresence();
            }
        });
    }

    showMultilApprovalModal() {
        if (this.getSelectedLeaveIds().length == 0) {
            this.toastrService.warning(this.translate.instant('Danh sách dữ liệu bị rỗng!'))
            return;
        }

        this.modalRef = this.modalService.show(ApprovalMultilOsComponent, {
            initialState:
                {
                    selectedLeaveIds: this.getSelectedLeaveIds()
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.approvalMultilEvent.subscribe((status) => {
            if (status) {
                this.updatePresence();
            }
        });
    }

    showSendMultilApproval() {
        if (this.getSelectedLeaveIds().length == 0) {
            this.toastrService.warning('Danh sách dữ liệu bị rỗng!')
            return;
        }

        this.modalRef = this.modalService.show(SendApprovalMultilOsComponent, {
            initialState:
                {
                    selectedLeaveIds: this.getSelectedLeaveIds()
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.sendMultilApprovalEvent.subscribe((value) => {
            if (value) {
                this.updatePresence();
            }
        });
    }


    disabledCheckBox(onsiteRemote) {
        let disable: boolean = false;
        if (this.hasRole(ROLE_LIST.COO)) {
            disable = onsiteRemote.requestWorkOutsideStatus !== Constant.LEADER_APPROVED;
        } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
            if ((onsiteRemote.requestWorkOutsideStatus == Constant.SENT_REQUEST && onsiteRemote.employeeCode ==  this.userStorage.getUserInfo().userCode) ||
                (onsiteRemote.requestWorkOutsideStatus == Constant.REJECTED && onsiteRemote.employeeCode !==  this.userStorage.getUserInfo().userCode) ||
                (onsiteRemote.requestWorkOutsideStatus == Constant.LEADER_APPROVED) ||
                (onsiteRemote.requestWorkOutsideStatus == Constant.APPROVED)){
                    disable = true
                }
        } else {
            disable = (onsiteRemote.requestWorkOutsideStatus !== Constant.PENDING) && (onsiteRemote.requestWorkOutsideStatus !== Constant.REJECTED);
        }

        return disable;
    }

    hasRole(roleCode) {
        let roles = this.roles.filter(role =>
            role.code === roleCode
        );
        return roles.length > 0;
    }

    getSelectedLeaveIds() {
        let selectedLeave = this.listOnsiteRemote.filter(leave => (leave.checked != false && leave.checked !== undefined && !this.disabledCheckBox(leave)));
        let leaveIds = [];
        if (selectedLeave.length > 0) {
            selectedLeave.forEach(leave => {
                leaveIds.push(leave.id)
            });
        }
        return leaveIds;
    }

    updateMultilPresenceStatus(listOnsiteRemoteUpdated) {
        listOnsiteRemoteUpdated.forEach(element => {
            let presenceIndex = this.listOnsiteRemote.findIndex((presenceElement => presenceElement.id == element.id));
            this.listOnsiteRemote[presenceIndex].requestWorkOutsideStatus = element.requestWorkOutsideStatus;
        });
    }

    canRefuseApprovalOnsiteRemoteBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    canApprovalOnsiteRemoteBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    notSendMultiApprovedOnsiteRemoteBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.COO
        );

        if(this.hasRole(ROLE_LIST.COO)) {
            this.isHiddenBtn = true;
        }
        return !(hasPermission.length > 0);
    }

    getStatus(status) {
        return this.statusArray.find((e) => e.statusCode === status)
    }

    renderWorkTypeName(workType) {
        switch (workType) {
            case ConstantPresence.ATTENDANCE : 
            return this.translate.instant("timeManager.summary.in_the_office");
            case ConstantPresence.REMOTE : 
            return this.translate.instant("timeManager.summary.remote");
            case ConstantPresence.ONSITE : 
            return this.translate.instant("timeManager.summary.onsite");
            case ConstantPresence.LEAVE : 
            return this.translate.instant("timeManager.summary.off");
            case ConstantPresence.OVERTIME : 
            return this.translate.instant("timeManager.summary.overtime");
        }
    }

    getClass () {
        if (this.isHiddenBtn) return 'add-btn'
        return 'btn-success'
    }
}

