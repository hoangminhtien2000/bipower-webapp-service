import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {EditOnleaveManagementComponent} from "../edit-onleave-management/edit-onleave-management.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {ROLE_LIST} from "../../../../core/common/constant";
import {UnapprovalMultilComponent} from "./unapproval-multil/unapproval-multil.component";
import {ApprovalMultilComponent} from "./approval-multil/approval-multil.component";
import {SendApprovalMultilComponent} from "./send-approval-multil/send-approval-multil.component";
import {ApprovalComponent} from "./approval/approval.component";
import {RefuseApprovalComponent} from "./refuse-approval/refuse-approval.component";
import {RefuseUnsubscribeComponent} from "./refuse-unsubscribe/refuse-unsubscribe.component";
import {ConfirmUnsubscribeComponent} from "./confirm-unsubscribe/confirm-unsubscribe.component";
import {UnsubscribeComponent} from "./unsubscribe/unsubscribe.component";
import {Constant} from "../../../../core/helper/leave/constants";
import {getDaysByHours} from "../../../../core/helper/leave/calculateLeaveHours";
import {UserStorage} from "../../../../core/storage/user.storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-list-leave-management',
    templateUrl: './list-leave-management.component.html',
    styleUrls: ['./list-leave-management.component.css']
})

export class ListLeaveManagementComponent implements OnChanges {
    @Input() listLeave;
    @Input() paginationInfor;
    @Output() pageEvent = new EventEmitter<any>()
    @Output() pageChangeEvent = new EventEmitter<any>()
    public tank = [];
    pageIndex = 0;
    public modalRef: BsModalRef;
    public checkAll: boolean = false;
    public onLeaveLeaveType = OnleaveManagementService.valueLeaveType;
    public onLeaveleaveStatus = OnleaveManagementService.leaveStatus;
    roles = this.userStorage.getUserRoles();
    user: any = this.userStorage.getUserInfo();

    constructor(public modalService: BsModalService,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
                private userStorage: UserStorage,
                private translate: TranslateService

    ) {
    }

    ngOnChanges(): void {
        if (this.listLeave !== undefined) {
            this.tank = this.listLeave
        }
    }

    pageChange(pageIndex: number): void {
        this.paginationInfor.number = pageIndex;
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
        for (let index = 0; index < this.listLeave.length; index++) {
            const item = this.listLeave[index];
            if (item.isDisabled) continue;
            item.checked = flag;
        }
    }

    onClickCheckBox(leave: any) {
        const finder = this.listLeave.find(el => el.employeeLeave.id == leave.employeeLeave.id);
        finder.checked = !finder.checked;
        this.checkAll = this.listLeave.filter(this.filterList()).length == this.listLeave.filter(el => el.isDisabled != true).length;
    }

    filterList() {
        return el => el.checked == true && el.isDisabled != true;
    }

    showUpdateLeaveModal(leave) {
        this.modalRef = this.modalService.show(EditOnleaveManagementComponent, {
            initialState:
                {
                    leave: {
                        id: leave.employeeLeave.id,
                        leaveType: leave.employeeLeave.leaveType,
                        leaveStatus: leave.employeeLeave.leaveStatus,
                        leaveFromAt: leave.employeeLeave.leaveFromAt,
                        leaveToAt: leave.employeeLeave.leaveToAt,
                        leaveHour: leave.employeeLeave.leaveHour,
                        reason: leave.employeeLeave.reason,
                        companyEmail: leave.companyEmail
                    }
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
        });
        this.modalRef.content.updateLeaveEvent.subscribe((value) => {
            if (value) {
                this.updateLeave(value);
            }
        });
    }

    updateLeave(leave) {
        const index = this.listLeave.findIndex(object => {
            return object.employeeLeave.id === leave.id;
        });
        this.listLeave[index].employeeLeave = leave;
    }

    showConfirmUnSubscribeModal(leave) {
        this.modalRef = this.modalService.show(ConfirmUnsubscribeComponent, {
            initialState: {leave: leave},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,

        });
        this.modalRef.content.confirmUnSubscribeEvent.subscribe((value) => {
            if (value) {
                this.updateListEmitEvent(value);
            }
        });
    }

    showApprovalModal(leave) {
        this.modalRef = this.modalService.show(ApprovalComponent, {
            initialState: {leave: leave},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });
        this.modalRef.content.approvalEvent.subscribe((value) => {
            if (value) {
                this.updateListEmitEvent(value);
            }
        });
    }

    showUnSubscribe(leave) {
        this.modalRef = this.modalService.show(UnsubscribeComponent, {
            initialState: {leave: leave},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });
        this.modalRef.content.unSubscribeEvent.subscribe((value) => {
            if (value) {
                this.updateListEmitEvent(value);
            }
        });
    }

    updateListEmitEvent(listLeaveUpdate) {
        listLeaveUpdate.forEach(element => {
            let leaveIndex = this.listLeave.findIndex((leaveElement => leaveElement.employeeLeave.id == element.id));
            this.listLeave[leaveIndex].employeeLeave.leaveStatus = element.leaveStatus;
        });
    }

    showRefuseUnSubscribe(leave) {
        this.modalRef = this.modalService.show(RefuseUnsubscribeComponent, {
            initialState: {leave: leave},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });
        this.modalRef.content.refuseUnSubscribeEvent.subscribe((value) => {
            if (value) {
                this.updateListEmitEvent(value);
            }
        });
    }

    showRefuseApprovalModal(leave) {
        this.modalRef = this.modalService.show(RefuseApprovalComponent, {
            initialState: {leave: leave},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });
        this.modalRef.content.refuseApprovalEvent.subscribe((value) => {
            if (value) {
                this.updateLeave(value);
            }
        });
    }

    getLeaveType(leaveType: string) {
        const finder: any = this.onLeaveLeaveType.find(el => el.value == leaveType);
        if (finder) {
            return this.translate.instant(finder.desc);
        }
        return '';
    }

    getLeaveStatus(leaveStatus: string) {
        const finder: any = this.onLeaveleaveStatus.find(el => el.value == leaveStatus);
        if (finder) {
            return this.translate.instant(finder.desc);
        }
        return '';
    }

    hasPermission(roles: string[]) {
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.leaveService.hasRole(role)) {
                return true;
            }
        }
        return false;
    }

    showMultilUnApprovalModal() {
        this.modalRef = this.modalService.show(UnapprovalMultilComponent, {
            initialState:
                {
                    selectedLeaveIds: this.getSelectedLeaveIds()
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.unApprovalMultilEvent.subscribe((value) => {
            if (value) {
                this.updateMultilLeaveStatus(value);
            }
        });
    }

    showMultilApprovalModal() {
        this.modalRef = this.modalService.show(ApprovalMultilComponent, {
            initialState:
                {
                    selectedLeaveIds: this.getSelectedLeaveIds()
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.approvalMultilEvent.subscribe((value) => {
            if (value) {
                this.updateMultilLeaveStatus(value);
            }
        });
    }

    showSendMultilApproval() {
        this.modalRef = this.modalService.show(SendApprovalMultilComponent, {
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
                this.updateMultilLeaveStatus(value);
            }
        });
    }

    disabledCheckBox(leave) {
        let disable: boolean;
        if (this.hasRole(ROLE_LIST.C_B)) {
            disable = leave.employeeLeave.leaveStatus !== Constant.LEADER_APPROVED;
        } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
            disable = (leave.employeeLeave.leaveStatus !== Constant.SENT_REQUEST) && (leave.employeeLeave.leaveStatus !== Constant.REJECTED);
        } else {
            disable = (leave.employeeLeave.leaveStatus !== Constant.PENDING) && (leave.employeeLeave.leaveStatus !== Constant.REJECTED);
        }
        if (leave.employeeLeave.leaveStatus === Constant.REJECTED) {
            disable = !this.belongsToTheUser(leave);
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
        let selectedLeave = this.listLeave.filter(leave => (leave.checked != false && leave.checked !== undefined && !this.disabledCheckBox(leave)));
        let leaveIds = [];
        if (selectedLeave.length > 0) {
            selectedLeave.forEach(leave => {
                leaveIds.push(leave.employeeLeave.id)
            });
        }
        return leaveIds;
    }

    updateMultilLeaveStatus(listLeaveUpdated) {
        listLeaveUpdated.forEach(element => {
            let leaveIndex = this.listLeave.findIndex((leaveElement => leaveElement.employeeLeave.id == element.id));
            this.listLeave[leaveIndex].employeeLeave.leaveStatus = element.leaveStatus;
        });
    }

    canApprovalLeaveBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.C_B ||
            role.code === ROLE_LIST.COO
        );
        return hasPermission.length > 0;
    }

    canRefuseApprovalLeaveBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    canApprovalLeave(leave) {
        if (leave) {
            return (leave.employeeLeave.leaveStatus === Constant.SENT_REQUEST && this.hasRole(ROLE_LIST.PRODUCT_OWNER)) ||
                (leave.employeeLeave.leaveStatus === Constant.LEADER_APPROVED && this.hasRole(ROLE_LIST.C_B));
        }
    }

    canRefuseApprovalLeave(leave: any = null) {
        if (leave) {
            return (leave.employeeLeave.leaveStatus === Constant.SENT_REQUEST && this.hasRole(ROLE_LIST.PRODUCT_OWNER)) ||
                (leave.employeeLeave.leaveStatus === Constant.LEADER_APPROVED && this.hasRole(ROLE_LIST.C_B));
        }
    }

    canConfirmUnSubscribeLeave(leave) {
        if (leave) {
            return leave.employeeLeave.leaveStatus === Constant.WAITING_CANCEL_REQ_APPROVED &&
                this.hasRole(ROLE_LIST.C_B);
        }
    }

    canRefuseUnSubscribeLeave(leave) {
        if (leave) {
            return leave.employeeLeave.leaveStatus === Constant.WAITING_CANCEL_REQ_APPROVED &&
                this.hasRole(ROLE_LIST.C_B);
        }
    }

    canUnSubscribe(leave) {
        return this.belongsToTheUser(leave.companyEmail) &&
            (leave.employeeLeave.leaveStatus != Constant.WAITING_CANCEL_REQ_APPROVED &&
                leave.employeeLeave.leaveStatus != Constant.CANCEL_REQUEST_REJECTED &&
                leave.employeeLeave.leaveStatus != Constant.CANCEL_REQUEST_APPROVED);
    }

    belongsToTheUser(leave) {
        return this.userStorage.isMyRecord(leave)
    }

    renderLeaveTime(leave) {
        return leave.employeeLeave.leaveType === Constant.COMPENSATORY_LEAVE ? leave.employeeLeave.leaveHour + this.translate.instant("timeManager.totalEmployee.hours") : getDaysByHours(leave.employeeLeave.leaveHour) + this.translate.instant("timeManager.totalEmployee.days");
    }

    canShowSendMultilApproval() {
        return !this.hasRole(ROLE_LIST.C_B)
    }
}


