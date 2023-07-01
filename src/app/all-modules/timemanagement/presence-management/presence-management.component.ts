import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {
    ModalListOnsiteRemoteComponent
} from "./presence-onsite-remote/modal-list-onsite-remote/modal-list-onsite-remote.component";
import {ListCheckinCheckoutComponent} from "./list-checkin-checkout/list-checkin-checkout.component";
import {PresenceManagementService} from "../../../core/services/presence-management.service";
import {hasRoles} from "../../../core/helper/role";
import {ROLE_LIST} from "../../../core/common/constant";
import {Constant} from "../../../core/helper/presence/constants";
import { PresenceComponent } from './list-checkin-checkout/presence/presence.component';
import { PresenceService } from 'src/app/core/services/presence.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import {Subscription} from "rxjs";
import {DataSevice} from "../../../core/services/data.sevice";
import { ModalUpdateOnsiteRemoteComponent } from './presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/modal-update-onsite-remote/modal-update-onsite-remote.component';
import * as moment from 'moment';
import { EditOnleaveManagementComponent } from '../onleave-management/edit-onleave-management/edit-onleave-management.component';
import { OnleaveManagementService } from 'src/app/core/services/onleave-management.service';
import { TimeManagementService } from 'src/app/core/services/time-management.service';
import { AddOrEditOtManagermentComponent } from '../overtime-management/add-or-edit-ot-managerment/add-or-edit-ot-managerment.component';

@Component({
    selector: 'app-presence-management',
    templateUrl: './presence-management.component.html',
    styleUrls: ['./presence-management.component.scss']
})
export class PresenceManagementComponent implements OnInit {
    public modalRef: BsModalRef;
    @Output() messageData;
    active = "tabEmployee";
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    tabCode: string;
    subscription: Subscription;

    constructor(private route: Router,
        public modalService: BsModalService,
        private presence: PresenceManagementService,
        private leaveService: OnleaveManagementService,
        private activatedRoute: ActivatedRoute,
        public presenceModal: BsModalRef,
        private presenceService: PresenceService,
        private toastrService: ToastrService,
        private datePipe: DatePipe,
        private data: DataSevice,
        private timeManagementService: TimeManagementService,
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.id && params.workType && params.date) {
                switch (params.workType) {
                    case Constant.ATTENDANCE:
                        return this.showPresenceDetailModal(params.id);
                    case Constant.ONSITE:
                        return this.showOnsiteRemoteModal(
                            params.id
                        );
                    case Constant.REMOTE:
                        return this.showOnsiteRemoteModal(
                            params.id
                        );
                    case Constant.LEAVE:
                        return this.showLeaveModal(params.id)
                    case Constant.OVERTIME:
                        return this.showDetailOvertime(params.id)
                }
            }
        });
    }

    ngOnInit(): void {
        this.subscription = this.data.currentTabCode.subscribe(tabCode => this.tabCode = tabCode)
        this.data.changeTabCode(this.active)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();}

    goToHistory() {
        this.route.navigate(['/layout/timemanagement/presencemanagement/history']);
    }

    goToSummaryPage() {
        this.route.navigate(["/layout/timemanagement/presencemanagement/summary"]);
    }

    canSeeSummaryPage() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B ||
            role.code === ROLE_LIST.COO
        );
        return hasPermission.length > 0;
    }

    canSeeTabsManager() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B ||
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.COO
        );
        return hasPermission.length > 0;
    }

    showModalListOnsiteRemote(params = null) {
        this.modalRef = this.modalService.show(ModalListOnsiteRemoteComponent, {
            initialState: {
                params: params,
                tabCode: this.tabCode
            },
            class: 'modal-left modal-dialog-centered w-70 max-width-modal expand',
            ignoreBackdropClick: true,
        });
    }

    showListCheckinCheckoutModal(params = null) {
        this.modalRef = this.modalService.show(ListCheckinCheckoutComponent, {
            initialState: {
                params: params
            },
            class: 'modal-left modal-dialog-centered w-70 max-width-modal expand',
            ignoreBackdropClick: true,
        });
    }

    showPresenceDetailModal(id: number) {
        this.presenceService.getOnsiteRemoteDetail(id).subscribe(res => {
            if (res.success) {
                res.data.checkinTimeEdit = this.datePipe.transform(res.data.start + " " + res.data.checkinTimeEdit, "dd/MM/yyyy HH:mm"),
                res.data.checkoutTimeEdit = this.datePipe.transform(res.data.start + " " + res.data.checkoutTimeEdit, "dd/MM/yyyy HH:mm"),
                    this.presenceModal = this.modalService.show(PresenceComponent, {
                        initialState: {
                            presence: res.data
                        },
                        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                        ignoreBackdropClick: true,
                        keyboard: false,
                    });
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })

    }

    showOnsiteRemoteModal(id: number) {
        this.presenceService.getOnsiteRemoteDetail(id).subscribe(res => {
            if (res.success) {
                this.modalRef = this.modalService.show(ModalUpdateOnsiteRemoteComponent, {
                    initialState:
                    {
                        osRefModal: {
                            id: res.data.id,
                            teamName: res.data.teamName,
                            fullName: res.data.fullName,
                            fromTime: moment(res.data.fromTime).format(Constant.DATE_TIME_FORMAT),
                            toTime: moment(res.data.toTime).format(Constant.DATE_TIME_FORMAT),
                            reason: res.data.reason,
                            requestWorkOutsideStatus: res.data.requestWorkOutsideStatus,
                            workType: res.data.workType,
                            workingLocation: res.data.workingLocation,
                            projectName: res.data.projectName,
                            employeeCode: res.data.employeeCode,
                        },
                        isDisabledCheckBox: true
                    },
                    class: 'modal-left modal-dialog-centered w-45 max-width-modal expand',
                    ignoreBackdropClick: true,
                    keyboard: false
                });
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })
    }

    showLeaveModal(id: number) {
        this.leaveService.getLeaveDetail(id).subscribe(res => {
            if (res.success) {
                this.modalRef = this.modalService.show(EditOnleaveManagementComponent, {
                    initialState:
                    {
                        leave: {
                            id: res.data.employeeLeave.id,
                            leaveType: res.data.employeeLeave.leaveType,
                            leaveStatus: res.data.employeeLeave.leaveStatus,
                            leaveFromAt: res.data.employeeLeave.leaveFromAt,
                            leaveToAt: res.data.employeeLeave.leaveToAt,
                            leaveHour: res.data.employeeLeave.leaveHour,
                            reason: res.data.employeeLeave.reason,
                            companyEmail: res.data.companyEmail
                        }
                    },
                    class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                    ignoreBackdropClick: true,
                });
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })
    }

    showDetailOvertime(id: number) {
        this.timeManagementService.findById(id).subscribe(result => {
            if (result.success) {
                this.modalRef = this.modalService.show(AddOrEditOtManagermentComponent, {
                    initialState: { value: result.data.overtimeDTO, companyEmail: result.data.companyEmail },
                    class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                    ignoreBackdropClick: true
                });
            } else if (result.success == false) {
                this.toastrService.error(result.message);
            }
        })
    }

    canShowListCheckinCheckoutModal() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.TEAM_LEADER) || hasRoles(ROLE_LIST.PRODUCT_OWNER);
    }

    canShowHistory() {
        return hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.TEAM_LEADER) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.COO);
    }
    clickTab(tab: string){
        this.data.changeTabCode(tab);
    }
}
