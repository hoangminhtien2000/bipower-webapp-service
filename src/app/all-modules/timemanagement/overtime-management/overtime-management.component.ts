import {Component, Input, OnInit} from '@angular/core';
import {TimeManagementService} from "../../../core/services/time-management.service";
import {FormGroup} from "@angular/forms";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {AddOrEditOtManagermentComponent} from './add-or-edit-ot-managerment/add-or-edit-ot-managerment.component';
import {ToastrService} from 'ngx-toastr';
import {RejectFormComponent} from './reject-form/reject-form.component';
import {ApproveFormComponent} from './approve-form/approve-form.component';
import {OT_STATUS, ROLE_LIST} from "../../../core/common/constant";
import {UserStorage} from "../../../core/storage/user.storage";
import {ActivatedRoute, Router} from '@angular/router';
import {UnsubscribeComponent} from "../onleave-management/list-leave-management/unsubscribe/unsubscribe.component";
import {UnsubscribeOvertimeComponent} from "./unsubscribe-overtime/unsubscribe-overtime.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-overtime-management',
    templateUrl: './overtime-management.component.html',
    styleUrls: ['./overtime-management.component.scss'],
})
export class OvertimeManagementComponent implements OnInit {
    @Input() listLeave;
    public lstData = [];
    public pageSize = 10;
    public pageIndex = 0;
    public totalPages = 0;
    public totalElements = 0;
    public model = [];
    public data: any = [];
    public isLoad = false;
    public searchForm: FormGroup;
    public checkAll: boolean = false;
    public preValueFormSearch = null;
    public pageArr = [];
    public numberOfElements = 0;
    public first = false;
    public last = false;
    private modalRef: BsModalRef;
    public listSelected: [] = [];
    ROLE_FULE = [ROLE_LIST.CEO, ROLE_LIST.CFO, ROLE_LIST.CMO, ROLE_LIST.COO, ROLE_LIST.HRA_LEADER, ROLE_LIST.PRM_LEADER, ROLE_LIST.CMO];
    public totalTimeOfBatch = 0;
    isRolePRM = false;
    roles = this.userStorage.getUserRoles();

    constructor(private timeManagementService: TimeManagementService,
                private modalService: BsModalService,
                private toastr: ToastrService,
                private userStorage: UserStorage,
                private router: Router,
                private route: ActivatedRoute,
                private translate: TranslateService,
    ) {
    }

    public overtimeStatuses = TimeManagementService.status;

    ngOnInit(): void {
        const id = this.route.snapshot.queryParams.id;
        if (id) {
            this.openDialogAddEdit({id: parseInt(id + "")});
        }
    }

    loadData(changePageSize: any = null, changePageIndex: any = null) {
        if (this.isLoad) {
            return;
        }
        this.isLoad = true;
        let dataInput: any = this.data;
        this.checkAll = false;
        if ((changePageSize == null && changePageIndex == null)) {
            if (this.pageSize >= 0) {
                dataInput.size = this.pageSize;
            }
            dataInput.page = 0;
            this.preValueFormSearch = dataInput;
        } else {
            dataInput = this.preValueFormSearch;
            if (this.data?.overtimeFromAt) {
                dataInput.overtimeFromAt = this.data.overtimeFromAt;
            }
            if (this.data.overtimeToAt) {
                dataInput.overtimeToAt = this.data.overtimeToAt;
            }
            if (changePageSize == true) {
                if (this.pageSize >= 0) {
                    dataInput.size = this.pageSize;
                }
            }
            if (changePageIndex == true) {
                if (this.pageIndex >= 0) {
                    dataInput.page = this.pageIndex > 1 ? this.pageIndex - 1 : 0;
                }
            } else {
                dataInput.page = 0;
                this.pageIndex = 0;
            }
        }
        this.timeManagementService.getPageSearch(dataInput).subscribe((data: any) => {
                this.lstData = data.data.results.content;
                for (let index = 0; index < this.lstData.length; index++) {
                    if (this.hasStatus(this.lstData[index].status, [OT_STATUS.APPROVED])) {
                        this.lstData[index].isDisabled = true;
                    } else if (this.hasRoleEmployee() && [OT_STATUS.SENT_REQUEST, OT_STATUS.APPROVED, OT_STATUS.LEADER_APPROVED].indexOf(this.lstData[index].status) >= 0) {
                        this.lstData[index].isDisabled = true;
                    } else if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER])
                        && this.hasStatus(this.lstData[index].status, [OT_STATUS.REJECTED])
                        && !this.isCreatedByMyself(this.lstData[index].companyEmail)) {
                        this.lstData[index].isDisabled = true;
                    } else if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER]) && !this.hasPermission([ROLE_LIST.PRM_LEADER])
                        && this.hasStatus(this.lstData[index].status, [OT_STATUS.LEADER_APPROVED])) {
                        this.lstData[index].isDisabled = true;
                    } else if (!this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER, ROLE_LIST.PRM_LEADER]) &&
                        this.hasStatus(this.lstData[index].status, [OT_STATUS.SENT_REQUEST, OT_STATUS.LEADER_APPROVED])) {
                        this.lstData[index].isDisabled = true;
                    } else if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER])
                        && this.hasStatus(this.lstData[index].status, [OT_STATUS.LEADER_APPROVED, OT_STATUS.APPROVED, OT_STATUS.REJECTED])
                        && !this.isCreatedByMyself(this.lstData[index].companyEmail)) {
                        this.lstData[index].isDisabled = true;
                    } else if (this.hasPermission([ROLE_LIST.PRM_LEADER, ...this.ROLE_FULE])
                        && [OT_STATUS.LEADER_APPROVED, OT_STATUS.SENT_REQUEST].indexOf(this.lstData[index].status) < 0) {
                        this.lstData[index].isDisabled = true;
                    }
                }
                this.totalPages = data.data.results.totalPages;
                this.pageArr = Array(this.totalPages).fill(0).map((_, i) => i + 1);
                this.totalElements = data.data.results.totalElements;
                this.numberOfElements = data.data.results.numberOfElements;
                this.last = data.data.results.last;
                this.first = data.data.results.first;
                this.totalTimeOfBatch = data.data.totalTimeOfBatch;
                this.isLoad = false;
            },
            err => {
                this.isLoad = false;
            });
    }

    canSeeBtn() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.PRM_LEADER
        );
        return hasPermission.length > 0;
    }
    showUnSubscribe(leave) {
        console.log(leave)
        this.modalRef = this.modalService.show(UnsubscribeOvertimeComponent, {
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
    canSeeBtn2() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRM_LEADER
        );
        this.isRolePRM = true
        return hasPermission.length > 0;
    }

    get isHidden() {
        return this.totalElements > 0;
    }

    onChangePageSize(page): void {
        this.pageSize = parseInt(page);
        this.loadData(true);
    }

    pageChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadData(true, true);
        // Lỗi gọi API 2 lần
    }

    onSearch(data) {
        this.data = data;
        this.loadData();
    }

    openDialogAddEdit(row: any) {
        this.timeManagementService.findById(row.id).subscribe(result => {
            if (result.success) {
                this.modalRef = this.modalService.show(AddOrEditOtManagermentComponent, {
                    initialState: {value: result.data.overtimeDTO, companyEmail: result.data.companyEmail},
                    class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                    ignoreBackdropClick: true
                });
                if (this.modalRef) {
                    (<AddOrEditOtManagermentComponent>this.modalRef.content).result.subscribe((res: any) => {
                        if (res.action == "save" || res.action == "isNew" || res.action == "saveAndApprove") {
                            this.timeManagementService.update(res.data, res.data.id).subscribe(result => {
                                if (result.success) {
                                    this.loadData();
                                    if (res.action == "isNew") {
                                        this.toastr.success(this.translate.instant("timeManager.add_onleave_management.sign_up_success"), this.translate.instant("timeManager.notification"));
                                    } else if (res.action == "save") {
                                        this.toastr.success(this.translate.instant("timeManager.edit_onleave_management.update_success"), this.translate.instant("timeManager.notification"));
                                    } else {
                                        this.toastr.success("timeManager.list_onleave.submit_approval_successfully", this.translate.instant("timeManager.notification"));
                                    }
                                    this.modalRef.hide();
                                } else {
                                    this.toastr.error(result.message)
                                }
                            }, error => {
                                this.toastr.error(error.error?.title)
                            });
                        }
                    });
                    (<AddOrEditOtManagermentComponent>this.modalRef.content).modalResult.subscribe((res: any) => {
                        if (res.action == "reject" || res.action == "approve") {
                            const data = {
                                overtimeIds: [res.data.id],
                                isApproved: res.action == "reject" ? false : true,
                                note: res.data.note ? res.data.note : ""
                            }
                            this.timeManagementService.confirManyOvertimeRequest(data).subscribe(result => {
                                if (result.success) {
                                    this.loadData();
                                    if (res.action == "reject") {
                                        this.toastr.success(this.translate.instant("timeManager.list_onleave.reject_approval_success"), this.translate.instant("timeManager.notification"));
                                    } else if (res.action == "approve") {
                                        this.toastr.success(this.translate.instant("timeManager.list_onleave.approval_success"), this.translate.instant("timeManager.notification"));
                                    }
                                    this.modalRef.hide();
                                } else {
                                    this.toastr.error(result.message)
                                }
                            }, error => {
                                this.toastr.error(error.error?.title)
                            });
                        }
                    });
                }
            } else if (result.success == false) {
                this.toastr.error(result.message);
            }
        })
    }

    onClickAllCheckBox(event) {
        let flag = !!event.target.checked;
        for (let index = 0; index < this.lstData.length; index++) {
            const item = this.lstData[index];
            if (item.isDisabled) continue;
            item.checked = flag;
        }
    }

    onClickCheckBox(row: any) {
        const finder = this.lstData.find(el => el.id == row.id);
        finder.checked = !finder.checked;
        this.checkAll = this.lstData.filter(this.filterList()).length == this.lstData.filter(el => el.isDisabled != true).length;
    }

    filterList() {
        return el => el.checked == true && el.isDisabled != true;
    }

    denied() {
        if (this.checkValid(false)) {
            return;
        }
        let len = this.lstData
            .filter(this.filterList())
            .map(el => ({overtimeId: el.id, status: el.status})).length;
        if (len > 0) {
            const modalRef = this.modalService.show(RejectFormComponent, {
                initialState: {value: null},
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            })
            if (modalRef) {
                (<RejectFormComponent>modalRef.content).result.subscribe(res => {
                    const dataFake = this.lstData.filter(this.filterList()).map(el => el.id)
                    const data = {
                        overtimeIds: dataFake,
                        isApproved: false,
                        note: res.note
                    }
                    this.timeManagementService.confirManyOvertimeRequest(data).subscribe(result => {
                        if (result.success) {
                            this.toastr.success(this.translate.instant("timeManager.list_onleave.reject_approval_success"));
                            this.loadData();
                            modalRef.hide();
                        } else {
                            this.toastr.error(result.message)
                        }
                    });
                });
            }
        } else {
            this.toastr.warning( this.translate.instant("timeManager.no_record_selected"), this.translate.instant("timeManager.warning"));
        }
    }

    approve() {
        if (this.checkValid(false)) {
            return;
        }
        let len = this.lstData
            .filter(this.filterList())
            .map(el => ({overtimeId: el.id, status: el.status})).length;
        if (len > 0) {
            const modalRef = this.modalService.show(ApproveFormComponent, {
                initialState: {value: len},
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            })
            if (modalRef) {
                (<ApproveFormComponent>modalRef.content).result.subscribe(res => {
                    const dataFake = this.lstData.filter(this.filterList()).map(el => el.id)
                    const data = {
                        overtimeIds: dataFake,
                        isApproved: true,
                    }
                    this.timeManagementService.confirManyOvertimeRequest(data).subscribe(result => {
                        if (result.success) {
                            this.toastr.success(this.translate.instant("timeManager.list_onleave.approval_success"));
                            this.loadData();
                            modalRef.hide();
                        } else if (result.success == false) {
                            this.toastr.error(result.message)
                        }
                    });
                });
            }
        } else {
            this.toastr.warning(this.translate.instant("timeManager.no_record_selected"), this.translate.instant("timeManager.warning"));
        }
    }

    approved() {
        if (this.checkValid(true)) {
            return;
        }
        let len = this.lstData
            .filter(this.filterList())
            .map(el => ({overtimeId: el.id})).length;
        if (len > 0) {
            const modalRef = this.modalService.show(ApproveFormComponent, {
                initialState: {
                    value: len,
                    title: "Xác nhận gửi phê duyệt thông tin làm ngoài giờ",
                    content: `Bạn có chắc chắn gửi phê duyệt thông tin cho ${len} phiếu đăng ký làm ngoài giờ không?`
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            })
            if (modalRef) {
                (<ApproveFormComponent>modalRef.content).result.subscribe(result => {
                    const dataFake = this.lstData.filter(this.filterList()).map(el => el.id)
                    const data = {overtimeIds: dataFake};
                    this.timeManagementService.sendManyOvertimeRequestToApprover(data).subscribe(result => {
                        if (result.success == true) {
                            this.toastr.success(this.translate.instant("timeManager.list_onleave.submit_approval_successfully"));
                            this.loadData();
                            modalRef.hide();
                        } else {
                            this.toastr.error(result.message)
                        }
                    });
                });
            }
        } else {
            this.toastr.warning(this.translate.instant("timeManager.no_record_selected"), this.translate.instant("timeManager.warning"));
        }
    }


    /**
     * if isPending = true => is send request approved
     * else isPending = false => is approve
     */
    checkValid(isPending: boolean = false) {
        for (let index = 0; index < this.lstData.length; index++) {
            const item = this.lstData[index];
            if (item.checked == true) {
                if (isPending) {
                    if (this.hasRoleEmployee()) {
                        if ([OT_STATUS.PENDING, OT_STATUS.REJECTED].indexOf(item.status) < 0) {
                            this.toastr.warning(this.translate.instant("timeManager.message"), this.translate.instant("timeManager.warning"));
                            return true;
                        }
                    } else if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER, ...this.ROLE_FULE])) {
                        if ([OT_STATUS.PENDING].indexOf(item.status) >= 0 && !this.isCreatedByMyself(item.companyEmail)) {
                            this.toastr.warning(this.translate.instant("timeManager.message1"), this.translate.instant("timeManager.warning"));
                            return true;
                        } else if ([OT_STATUS.SENT_REQUEST].indexOf(item.status) < 0 && !this.isCreatedByMyself(item.companyEmail)) {
                            this.toastr.warning(this.translate.instant("timeManager.message1"), this.translate.instant("timeManager.warning"));
                            return true;
                        } else if ([OT_STATUS.SENT_REQUEST].indexOf(item.status) >= 0) {
                            this.toastr.warning(this.translate.instant("timeManager.message1"), this.translate.instant("timeManager.warning"));
                            return true;
                        }
                    }
                } else {
                    if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER]) && [OT_STATUS.SENT_REQUEST].indexOf(item.status) < 0) {
                        this.toastr.warning(this.translate.instant("timeManager.message2"), this.translate.instant("timeManager.warning"));
                        return true;
                    } else if (this.hasPermission(this.ROLE_FULE) && [OT_STATUS.SENT_REQUEST, OT_STATUS.LEADER_APPROVED].indexOf(item.status) < 0) {
                        this.toastr.warning(this.translate.instant("timeManager.message3"), this.translate.instant("timeManager.warning"));
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getOverTimeStatus(status) {
        if (status == OT_STATUS.PENDING) {
            return this.translate.instant("timeManager.create_new");
        }
        if (status == OT_STATUS.SENT_REQUEST) {
            return this.translate.instant("timeManager.sent_request")
        }
        if (status == OT_STATUS.LEADER_APPROVED) {
            return this.translate.instant("timeManager.approved_by_team_leader");
        }
        if (status == OT_STATUS.APPROVED) {
            return this.translate.instant("timeManager.approved");
        }
        if (status == OT_STATUS.REJECTED) {
            return this.translate.instant("timeManager.reject_approval");
        }
        return status;
    }

    hasPermission(roles: string[]) {
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.timeManagementService.hasRole(role)) {
                return true;
            }
        }
        return false;
    }

    hasRoleEmployee() {
        let roles = [ROLE_LIST.PRM_LEADER, ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.HRA_LEADER, ROLE_LIST.CEO,
            ROLE_LIST.COO, ROLE_LIST.CFO, ROLE_LIST.CMO, ROLE_LIST.CTO];
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.timeManagementService.hasRole(role)) {
                return false;
            }
        }
        return true;
    }

    hasStatus(currentStatus: string = "", arrayStatus: any[] = []) {
        for (let index = 0; index < arrayStatus.length; index++) {
            if (currentStatus == arrayStatus[index]) {
                return true;
            }
        }
        return false;
    }

    roleColumnLen() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.CEO ||
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.CFO ||
            role.code === ROLE_LIST.CMO ||
            role.code === ROLE_LIST.CTO ||
            role.code === ROLE_LIST.HRA_LEADER ||
            role.code === ROLE_LIST.PRM_LEADER ||
            role.code === ROLE_LIST.PROJECT_MANAGER ||
            role.code === ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    get columnLen() {
        if (this.roleColumnLen()) {
            return 10;
        } else {
            return 8;
        }
    }

    isCreatedByMyself(email: string) {
        if (this.timeManagementService.getUserData()) {
            const userData = this.timeManagementService.getUserData();
            if (userData && userData.actionUser && userData.actionUser.email == email) {
                return true;
            }
        }
        return false;
    }
}
