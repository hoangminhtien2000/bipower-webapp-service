import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import * as moment from "moment";
import {ToastrService} from "ngx-toastr";
import jwt_decode from "jwt-decode";
import {userToken} from "../../../../../../../core/interfaces/userToken";
import {Constant} from "../../../../../../../core/helper/presence/constants";
import {ROLE_LIST} from "../../../../../../../core/common/constant";
import {getLeaveTime} from "../../../../../../../core/helper/presence/calculateOnsiteRemoteDays";
import {startDateLessThanEndDate} from "../../../../../../../core/helper/presence/validateUpdateOnsiteRemoteForm";
import {PresenceService} from "../../../../../../../core/services/presence.service";
import {
    approvedListOnsiteRemoteRequestModel,
    createOrUpdateOnsiteRemoteRequestModel,
    initOnsiteRemote
} from "../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";
import {OnleaveManagementService} from "../../../../../../../core/services/onleave-management.service";
import {getTimeRemainingByLeaveType} from "../../../../../../../core/helper/leave/calculateLeaveHours";
import {
    endBiggerThanEndWorkingDay,
    noLeave, noLunchTime, noWorkingDays,
    startLessThanStartWorkingDay, timeRegisteredLessThanTimeRemaining
} from "../../../../../../../core/helper/leave/validateUpdateLeaveForm";
import {leaveUpdateRequestModel} from "../../../../../../../core/models/request/LeaveRequestModel";
import {
    UnapprovalMultilOsComponent
} from "../unapproval-multil-os/unapproval-multil-os.component";
import {
    ApprovalMultilOsComponent
} from "../approval-multil-os/approval-multil-os.component";
import {ApprovalOsComponent} from "./approval-os/approval-os.component";
import {UnapprovalOsComponent} from "./unapproval-os/unapproval-os.component";
import {UserStorage} from "../../../../../../../core/storage/user.storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'modal-update-onsite-remote',
    templateUrl: './modal-update-onsite-remote.component.html',
    styleUrls: ['./modal-update-onsite-remote.component.scss']
})
export class ModalUpdateOnsiteRemoteComponent implements OnInit {
    @Output() modalUpdateOnsiteRemoteComponent = new EventEmitter<any>();
    osRefModal
    isDisabledCheckBox
    public workTypesOnsiteRemote = PresenceService.workTypesOnsiteRemote;
    updateOnsiteRemotePresentForm: FormGroup;
    leaveType;

    isHiddenBtnCloseOrCancel: boolean = true;
    isHiddenBtnReject: boolean = true;
    isHiddenBtnSave: boolean = true;
    isHiddenBtnSendAprroved: boolean = true;
    isHiddenBtnAprroved: boolean = true;

    disabledWorkType: boolean = false;
    disabledTimeRegister: boolean = false;
    disabledWorkingLocation: boolean = false;
    disabledProjectName: boolean = false;
    disabledReason: boolean = false;
    timeRangepicker;
    timeRemaining;
    reason;
    currentworkingType;
    workType: null;
    public PROJECTNAME = 'projectName'
    public WORKINGLOCATION = 'workingLocation'
    public REASON = 'reason'
    public isClose = false
    public textCloseOrCancel = 'Hủy'
    public textClose = 'Đóng'
    public textReject = 'Từ chối'
    onsiteRemote = initOnsiteRemote();
    user: userToken = jwt_decode(localStorage.getItem('access_token'));
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    @Output() updateOnsiteRemoteEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                public options: ModalOptions,
                private toastr: ToastrService,
                private fb: FormBuilder,
                public modalService: BsModalService,
                private presenceService: PresenceService,
                public userStorage: UserStorage,
                private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.setWorkType(this.osRefModal.workType)
        this.setProjectName(this.osRefModal.projectName)
        this.setWorkingLocation(this.osRefModal.workingLocation)
        this.setReason(this.osRefModal.reason)
        this.setId(this.osRefModal.id)
        this.setTimeRangepicker(this.osRefModal.fromTime, this.osRefModal.toTime);
        this.validateUpdateOnsiteRemotePresentForm();

        this.checkStatusBtn(this.osRefModal);
    }

    ngDoCheck() {
    }

    setCurrentworkingType(timeRemaining, selectedworkingType) {
        this.currentworkingType = {timeRemaining: timeRemaining, workingType: selectedworkingType}
    }

    validateUpdateOnsiteRemotePresentForm() {
        this.updateOnsiteRemotePresentForm = this.fb.group({
            workType: [this.onsiteRemote.workType, [Validators.required]],
            timeRegister: [this.onsiteRemote.timeRegister, [Validators.required]],
            workingLocation: [this.onsiteRemote.workingLocation, [Validators.maxLength(Constant.PH_ADDRESS_MAX_LENGTH)]],
            projectName: [this.onsiteRemote.projectName, [Validators.maxLength(Constant.PH_PROJECT_MAX_LENGTH)]],
            reason: [this.onsiteRemote.reason, [Validators.maxLength(Constant.PH_PROJECT_MAX_LENGTH)]],
        });
        return !this.updateOnsiteRemotePresentForm.invalid;
    }

    onDateRangePickerChanged() {
        this.onsiteRemote.fromTime = moment(this.onsiteRemote.timeRegister.startDate).format(Constant.DATE_TIME_FORMAT);
        this.onsiteRemote.toTime = moment(this.onsiteRemote.timeRegister.endDate).format(Constant.DATE_TIME_FORMAT);
    }

    setTimeRangepicker(startDate, endDate) {
        this.onsiteRemote.timeRegister = {startDate: startDate, endDate: endDate}
        this.onsiteRemote.fromTime = startDate;
        this.onsiteRemote.toTime = endDate;
    }

    closeModal() {
        this.modalRef.hide();
    }

    rendertimeRegister() {
        return this.currentworkingType.workingType === Constant.COMPENSATORY_LEAVE ? getLeaveTime(this.onsiteRemote.timeRegister.startDate, this.onsiteRemote.timeRegister.endDate).hours + this.translate.instant("timeManager.totalEmployee.hours") : getLeaveTime(this.onsiteRemote.timeRegister.startDate, this.onsiteRemote.timeRegister.endDate).days + this.translate.instant("timeManager.totalEmployee.days");
    }

    renderTimeRemaining() {
        return this.currentworkingType.workingType === Constant.COMPENSATORY_LEAVE ? this.currentworkingType.timeRemaining + this.translate.instant("present.btn.hours") : this.currentworkingType.timeRemaining + this.translate.instant("present.btn.days");
    }

    getLeaveDays() {
        return getLeaveTime(this.onsiteRemote.timeRegister.startDate, this.onsiteRemote.timeRegister.endDate).days
    }

    onChangeWorkType() {
        this.currentworkingType.workingType = this.onsiteRemote.workType
    }

    validateForm() {
        this.updateOnsiteRemotePresentForm.markAllAsTouched();
        const invalid = [];
        let controls = this.updateOnsiteRemotePresentForm.controls;

        for (const name in controls) {
            if (this.onsiteRemote.workType == "REMOTE" && (name == this.PROJECTNAME || name == this.WORKINGLOCATION)) continue
            if (this.onsiteRemote.workType == "ONSITE" && name == this.REASON) continue
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.updateOnsiteRemotePresentForm.errors;
    }

    onSave() {
        if (this.validateForm()) {
            this.onsiteRemote.sendApproveReq = false;
            let body = createOrUpdateOnsiteRemoteRequestModel(this.onsiteRemote);
            this.presenceService.updateOnsiteRemote(this.onsiteRemote.id, body).subscribe((res) => {
                if (res.success) {
                    this.modalUpdateOnsiteRemoteComponent.emit(res.success)
                    this.toastr.success("Lưu thành công");
                    this.closeModal();
                } else {
                    this.toastr.error(res.message);
                }
            }, error => {
                this.toastr.error('Lưu thất bại')
            })
        }
    }

    onSaveAndApprove() {
        if (this.validateForm()) {
            this.onsiteRemote.sendApproveReq = true;
            let body = createOrUpdateOnsiteRemoteRequestModel(this.onsiteRemote);
            this.presenceService.updateOnsiteRemote(this.onsiteRemote.id, body).subscribe((res) => {
                if (res.success) {
                    this.modalUpdateOnsiteRemoteComponent.emit(res.success)
                    this.toastr.success("Lưu và Gửi phê duyệt thành công");
                    this.closeModal();
                } else {
                    this.toastr.error(res.message)
                }
            }, error => {
                this.toastr.error('Lưu và Gửi phê duyệt thất bại')
            })
        }
    }

    onSendApprove() {
        if (this.validateForm()) {
            this.onsiteRemote.sendApproveReq = true;
            let body = createOrUpdateOnsiteRemoteRequestModel(this.onsiteRemote);
            this.presenceService.createOnsiteRemote(body).subscribe((res) => {
                if (res.success) {
                    this.toastr.success("Lưu và Gửi phê duyệt thành công");
                    this.closeModal();
                } else {
                    this.toastr.error(res.message)
                }
            }, error => {
                this.toastr.error('Lưu và Gửi phê duyệt thất bại')
            })
        }
    }

    blurAddress() {
        this.updateOnsiteRemotePresentForm.controls["workingLocation"].setValue(this.updateOnsiteRemotePresentForm.controls["workingLocation"].value.trim())
    }

    blurProject() {
        this.updateOnsiteRemotePresentForm.controls["projectName"].setValue(this.updateOnsiteRemotePresentForm.controls["projectName"].value.trim())
    }

    blurReason() {
        this.updateOnsiteRemotePresentForm.controls["reason"].setValue(this.updateOnsiteRemotePresentForm.controls["reason"].value.trim())
    }

    canStatusOS(osRefModal) {
        let isCanEdit = false
        if (osRefModal) {
            isCanEdit = osRefModal.requestWorkOutsideStatus=== Constant.PENDING || osRefModal.requestWorkOutsideStatus=== Constant.REJECTED;
            if(!isCanEdit) this.isHiddenBtnSave = true;
            return isCanEdit
        }
    }

    canApproveOrReject(osRefModal) {
        let isCanApproveOrReject = false
        if (osRefModal) {
            isCanApproveOrReject = osRefModal.requestWorkOutsideStatus=== Constant.SENT_REQUEST || osRefModal.requestWorkOutsideStatus=== Constant.LEADER_APPROVED;
            return isCanApproveOrReject
        }
    }

    hasRole(roleCode) {
        let roles = this.roles.filter(role =>
            role.code === roleCode
        );
        return roles.length > 0;
    }

    canSeeBtnCloseOrCancel(osRefModal) {
        let isCanSeeBtnCloseOrCancel = false;
        if (this.hasRole(ROLE_LIST.COO)) {
            isCanSeeBtnCloseOrCancel = this.canApproveOrReject(osRefModal);
            if (!isCanSeeBtnCloseOrCancel){
                this.isHiddenBtnSendAprroved = false;
                this.isClose = true;
                this.isHiddenBtnReject = false;
                this.isHiddenBtnSendAprroved = true;
            }
        } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
            isCanSeeBtnCloseOrCancel = this.canApproveOrReject(osRefModal);
            if (!isCanSeeBtnCloseOrCancel) this.isHiddenBtnSendAprroved = false;
        }

        return isCanSeeBtnCloseOrCancel
    }

    canSeeBtnReject(osRefModal) {
        let isCanApproveOrReject = false;
        if (this.hasRole(ROLE_LIST.COO)) {
            isCanApproveOrReject = this.canApproveOrReject(osRefModal);
            if (isCanApproveOrReject){
                this.isHiddenBtnSendAprroved = false;
                this.isHiddenBtnReject = false;
            }
        } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
            isCanApproveOrReject = this.canApproveOrReject(osRefModal);
            if (isCanApproveOrReject){
                this.isHiddenBtnSendAprroved = false;
                this.isHiddenBtnReject = false;
            }
        }

        return isCanApproveOrReject
    }

    canSeeBtnSaveOnsiteRemote(osRefModal) {
        let isCanSeeSendApproval = false;
        if (this.hasRole(ROLE_LIST.COO)) {
            isCanSeeSendApproval = this.canApproveOrReject(osRefModal);
            if (!isCanSeeSendApproval){
                this.isHiddenBtnSendAprroved = false;
                this.isClose = true;
                this.isHiddenBtnReject = false;
                this.isHiddenBtnSendAprroved = true;

            }
        } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
            isCanSeeSendApproval = this.canApproveOrReject(osRefModal);
            if (!isCanSeeSendApproval) this.isHiddenBtnSendAprroved = false;
        }

        return isCanSeeSendApproval
    }

    checkStatusBtn(osRefModal) {
        if (osRefModal) {
            if (this.hasRole(ROLE_LIST.COO)) {
                switch(osRefModal.requestWorkOutsideStatus) {
                    case Constant.PENDING:

                        break;
                    case Constant.SENT_REQUEST:

                        break;
                    case Constant.REJECTED:
                        this.isHiddenBtnCloseOrCancel = false;

                        break;
                    case Constant.LEADER_APPROVED:
                        this.isHiddenBtnReject = false;
                        this.isHiddenBtnAprroved = false;
                        this.isDisabledCheckBox = true;

                        break;
                    case Constant.APPROVED:
                        this.isHiddenBtnCloseOrCancel = false;
                        this.isClose = true;

                        break;

                    default:
                        this.isHiddenBtnCloseOrCancel = false;
                }
            } else if (this.hasRole(ROLE_LIST.PRODUCT_OWNER) || this.hasRole(ROLE_LIST.TEAM_LEADER)) {
                if (osRefModal.requestWorkOutsideStatus == Constant.REJECTED && osRefModal.employeeCode ==  this.userStorage.getUserInfo().userCode) {
                    this.isHiddenBtnSave = false;
                    this.isHiddenBtnSendAprroved = false;
                    this.isHiddenBtnCloseOrCancel = false;
                } else {
                    switch(osRefModal.requestWorkOutsideStatus) {
                        case Constant.PENDING:
                            this.isHiddenBtnSave = false;
                            this.isHiddenBtnSendAprroved = false;
                            this.isHiddenBtnCloseOrCancel = false;

                            break;
                        case Constant.SENT_REQUEST:
                            this.isHiddenBtnReject = false;
                            this.isHiddenBtnAprroved = false;
                            this.isDisabledCheckBox = true;

                            break;
                        case Constant.REJECTED:
                            this.isHiddenBtnCloseOrCancel = false;

                            break;
                        case Constant.LEADER_APPROVED:
                            this.isHiddenBtnCloseOrCancel = false;
                            this.isClose = true;

                            break;
                        case Constant.APPROVED:
                            this.isHiddenBtnCloseOrCancel = false;
                            this.isClose = true;

                            break;

                        default:
                            this.isHiddenBtnCloseOrCancel = false;
                            this.isClose = true;
                    }
                }
            }
            else {
                switch(osRefModal.requestWorkOutsideStatus) {
                    case Constant.PENDING:
                        this.isHiddenBtnSave = false;
                        this.isHiddenBtnSendAprroved = false;
                        this.isHiddenBtnCloseOrCancel = false;

                        break;
                    case Constant.SENT_REQUEST:
                        this.isHiddenBtnCloseOrCancel = false;
                        this.isClose = true;

                        break;
                    case Constant.REJECTED:
                        this.isHiddenBtnSave = false;
                        this.isHiddenBtnSendAprroved = false;
                        this.isHiddenBtnCloseOrCancel = false;

                        break;
                    case Constant.LEADER_APPROVED:
                        this.isHiddenBtnCloseOrCancel = false;
                        this.isClose = true;

                        break;
                    case Constant.APPROVED:
                        this.isHiddenBtnCloseOrCancel = false;
                        this.isClose = true;

                        break;

                    default:
                        this.isHiddenBtnCloseOrCancel = false;
                        this.isClose = true;
                }
            }
        }
    }

    canShowAddressProject() {
        if (this.onsiteRemote.workType == "ONSITE") return true;
        return false;
    }

    canShowReason() {
        if (this.onsiteRemote.workType == "REMOTE") return true;
        return false;
    }

    // teamName: onsiteRemote.teamName,
    // fullName: onsiteRemote.fullName,
    // leaveFromAt: onsiteRemote.checkoutTime,
    // leaveToAt: onsiteRemote.checkinTime,
    // reason: onsiteRemote.reason,
    // status: onsiteRemote.status,
    // workType: onsiteRemote.workType,
    // workingLocation: onsiteRemote.workingLocation,
    // projectName: onsiteRemote.projectName,

    setWorkType(workType) {
        this.onsiteRemote.workType = workType;
    }

    setProjectName(projectName) {
        this.onsiteRemote.projectName = projectName;
        }

    setWorkingLocation(workingLocation) {
        this.onsiteRemote.workingLocation = workingLocation;
        }

    setReason(reason) {
        this.onsiteRemote.reason = reason;
    }

    setId(id) {
        this.onsiteRemote.id = id;
    }

    getClassOS () {
        if (this.onsiteRemote.workType == "REMOTE") return 'popUpTable-modify'
        return '';
    }

    getClassOSCloseModal () {
        if (this.isClose) return 'btn-success'
        return '';
    }

    showUnApprovalModal() {
        let arrayPresenceId = [];
        arrayPresenceId.push(this.osRefModal.id);

        this.closeModal();
        this.modalRef = this.modalService.show(UnapprovalOsComponent, {
            initialState:
                {
                    selectedPresenceId: arrayPresenceId
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.unApprovalEvent.subscribe((status) => {
            if (status) {
                this.modalUpdateOnsiteRemoteComponent.emit(status);
            }
        });
    }

    showApprovalModal() {
        let arrayPresenceId = [];
        arrayPresenceId.push(this.osRefModal.id);

        this.closeModal();
        this.modalRef = this.modalService.show(ApprovalOsComponent, {
            initialState:
                {
                    selectedPresenceId: arrayPresenceId
                },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
        });

        this.modalRef.content.approvalEvent.subscribe((status) => {
            if (status) {
                this.modalUpdateOnsiteRemoteComponent.emit(status);
            }
        });
    }
}
