import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PresenceService} from "../../../../core/services/presence.service";
import {ToastrService} from "ngx-toastr";
import {SearchPresencesContent} from "../../../../core/models/response/presenceResponse.model";
import {Constant} from "../../../../core/helper/presence/constants";
import {getDateTimeString, setStatusOfPresences} from "../../../../core/helper/presence/common";
import {
    initPagination
} from "../../../../core/helper/pagination";
import {ApprovalPresenceComponent} from "./approval-presence/approval-presence.component";
import {RejectPresenceComponent} from "./reject-presence/reject-presence.component";
import {ROLE_LIST} from "../../../../core/common/constant";
import {EmployeeService} from "../../../../core";
import {hasRoles} from "../../../../core/helper/role";
import {PresenceComponent} from "./presence/presence.component";
import {
    searchPresenceParamsRequestModel,
    searchPresenceRequestModel
} from "../../../../core/models/request/PresenceRequestModel";
import * as moment from "moment/moment";

@Component({
    selector: 'app-list-checkin-checkout',
    templateUrl: './list-checkin-checkout.component.html',
    styleUrls: ['./list-checkin-checkout.component.scss']
})
export class ListCheckinCheckoutComponent implements OnInit {
    presences: Array<SearchPresencesContent>;
    params;
    timeRangepicker;
    teams = [];
    teamId = null;
    employeeName = null;
    employeeCode = null;
    presenceStatus = null;
    checkedPresenceIds = [];
    statusArray = Constant.PRESENCE_STATUS_ARRAY.filter(res => res.statusCode !== Constant.PENDING);
    size = initPagination().size;
    page = initPagination().page;
    pageSize = initPagination().pageSize;
    pageIndex = initPagination().pageIndex;
    totalPages = initPagination().totalPages;
    totalElements = initPagination().totalElements;
    numberOfElements = initPagination().numberOfElements;

    constructor(
        private presenceService: PresenceService,
        private employeeSerrvice: EmployeeService,
        private toastrService: ToastrService,
        public modalService: BsModalService,
        public approvalModal: BsModalRef,
        public rejectModal: BsModalRef,
        public presenceModal: BsModalRef) {
    }

    ngOnInit(): void {
        this.fetchTeams();
        if (this.params) {
            this.timeRangepicker = {startDate: this.params.date, endDate: this.params.date}
        } else {
            this.initTimeRangePicker();
        }
        this.searchPresences();
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

    initTimeRangePicker() {
        this.timeRangepicker = {startDate: moment().startOf('month').format(Constant.DATE_FORMAT), endDate: moment().format(Constant.DATE_FORMAT)}
    }
    onKeypress(event) {
        if(event.keyCode == 13){
            this.searchPresences();
        }
    }
    searchPresences() {
        let body = searchPresenceRequestModel(this.teamId, this.employeeName, this.employeeCode, this.timeRangepicker.startDate, this.timeRangepicker.endDate, this.presenceStatus);
        let params = searchPresenceParamsRequestModel(this.page, this.size);
        this.presenceService.searchPresences(body, params).subscribe(res => {
            if (res.success) {
                this.presences = setStatusOfPresences(res.data.content);
                this.setPagination(res.data.totalPages, res.data.totalElements, res.data.numberOfElements)
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })
        if (this.params) {
            this.autoShowPresenceDetailModal(this.params.workTimeId);
        }
    }

    autoShowPresenceDetailModal(workTimeId) {
        let presence = this.findPresenceById(workTimeId);
        if (this.canAutoShowPresenceDetailModal(presence)) {
            this.showPresenceDetailModal(presence);
        }
    }

    canAutoShowPresenceDetailModal(presence) {
        let flag = false;
        if (hasRoles(ROLE_LIST.C_B)) {
            if (presence && presence.status == Constant.PRESENCE_STATUS.LEADER_APPROVED) {
                flag = true;
            }
        }
        if (hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER)) {
            if (presence && presence.status == Constant.PRESENCE_STATUS.SENT_REQUEST) {
                flag = true;
            }
        }
        return flag;
    }

    findPresenceById(workTimeId) {
        if (this.presences.length > 0) {
            return this.presences.find(e => e.id == +workTimeId);
        }
    }

    setPagination(totalPages, totalElements, numberOfElements) {
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.numberOfElements = numberOfElements;
    }

    setTimeRangePicker(time) {
        this.timeRangepicker = {startDate: moment(time.startDate).format(Constant.DATE_FORMAT), endDate: moment(time.endDate).format(Constant.DATE_FORMAT)}
    }

    onDateRangePickerChanged(event) {
        this.setTimeRangePicker(event);
    }

    renderTimeOld(checkinTime, checkoutTime) {
        return getDateTimeString(checkinTime, checkoutTime)
    }

    renderTimeEdit(checkinTimeEdit, checkoutTimeEdit) {
        return getDateTimeString(checkinTimeEdit, checkoutTimeEdit)
    }

    getStatus(status) {
        return this.statusArray.find((e) => e.statusCode === status)
    }

    onSearchPresences() {
        this.page = initPagination().page;
        this.size = initPagination().size;
        this.searchPresences();
    }

    changePageNumber(event) {
        if (event) {
            this.page = event;
            this.searchPresences();
        }
    }

    changePageSize(value) {
        if (value) {
            this.size = value;
            this.page = initPagination().page;
            this.searchPresences();
        }
    }

    checkedManyCheckbox(event) {
        if (event.target.checked) {
            this.presences.forEach(presence => {
                if (!this.isDisableCheckbox(presence) && !this.checkedPresenceIds.includes(presence.id)) {
                    this.checkedPresenceIds.push(presence.id);
                }
            })
        } else {
            this.checkedPresenceIds = [];
        }
    }

    isDisableCheckbox(presence) {
        if (hasRoles(ROLE_LIST.C_B)) {
            return presence.status == Constant.PRESENCE_STATUS.APPROVED ||
                presence.status == Constant.PRESENCE_STATUS.REJECTED
        }
        if (hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER)) {
            return presence.status == Constant.PRESENCE_STATUS.LEADER_APPROVED ||
                presence.status == Constant.PRESENCE_STATUS.APPROVED ||
                presence.status == Constant.PRESENCE_STATUS.REJECTED
        }
    }

    isCheckedCheckbox(presence) {
        return !!(this.checkedPresenceIds.find(checked => checked === presence.id))
    }

    checkedOneCheckbox(event, presence) {
        if (event.target.checked) {
            if (!this.checkedPresenceIds.includes(presence.id)) {
                this.checkedPresenceIds.push(presence.id);
            }
        } else {
            this.checkedPresenceIds = this.checkedPresenceIds.filter(function (presenceId, index, arr) {
                return +presenceId != +presence.id;
            });
        }
    }

    reject() {
        if (!this.disableApprovalAndRejectButton()) {
            this.rejectModal = this.modalService.show(RejectPresenceComponent, {
                initialState: {
                    presenceIds: this.checkedPresenceIds
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false,
            });
        }
        this.rejectModal.content.rejectPresencesEvent.subscribe((status) => {
            if (status) {
                this.updatePresencesEvent()
            }
        });
    }

    approval() {
        if (!this.disableApprovalAndRejectButton()) {
            this.approvalModal = this.modalService.show(ApprovalPresenceComponent, {
                initialState: {
                    presenceIds: this.checkedPresenceIds
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false,
            });
        }
        this.approvalModal.content.approvalPresencesEvent.subscribe((status) => {
            if (status) {
                this.updatePresencesEvent()
            }
        });
    }

    disableApprovalAndRejectButton() {
        return this.checkedPresenceIds.length == 0;
    }

    updatePresencesEvent() {
        this.resetCheckedPresenceIds();
        this.searchPresences();
    }

    showPresenceDetailModal(presence) {
        this.resetCheckedPresenceIds();
        this.presenceModal = this.modalService.show(PresenceComponent, {
            initialState: {
                presence: presence
            },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false,
        });

        this.presenceModal.content.approvalPresenceEvent.subscribe((status) => {
            if (status) {
                this.updatePresencesEvent()
            }
        });

        this.presenceModal.content.rejectPresenceEvent.subscribe((status) => {
            if (status) {
                this.updatePresencesEvent()
            }
        });
    }

    resetCheckedPresenceIds() {
        this.checkedPresenceIds = [];
    }

    canApproval() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    canReject() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    canSearchByTeams() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    canSearchByName() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    canSearchByCode() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER);
    }

    blurCode() {
        this.employeeCode = this.employeeCode ? this.employeeCode.trim() : this.employeeCode;
    }

    blurName() {
        this.employeeName = this.employeeName ? this.employeeName.trim() : this.employeeName;
    }

    closeModal() {
        this.modalService.hide();
    }
}
