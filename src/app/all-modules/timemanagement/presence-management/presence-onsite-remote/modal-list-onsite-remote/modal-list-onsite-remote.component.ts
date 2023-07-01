import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {Constant} from "../../../../../core/helper/leave/constants";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'modal-list-onsite-remote',
    templateUrl: './modal-list-onsite-remote.component.html',
    styleUrls: ['./modal-list-onsite-remote.component.scss']
})
export class ModalListOnsiteRemoteComponent implements OnInit {
    @Output() onSubmit = new EventEmitter<any>();
    @Output() listOnsiteRemote;
    @Output() paginationInfor = {
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        pageSize: 10,
        number: 0
    };
    params;
    tabCode;
    changePageSize = this.paginationInfor.pageSize;
    changePage = this.paginationInfor.number;
    public data: any = [];
    updateOnsiteRemoteNumber = 0;

    constructor(public modalRef: BsModalRef,
                public modalService: BsModalService,
                private leaveService: OnleaveManagementService,
                public options: ModalOptions,
                private translate: TranslateService
    ) {
        this.tabCode = this.options.initialState?.tabCode;
    }
    ngOnInit(): void {
    }

    closeModal() {
        this.modalRef.hide();
    }

    searchListOnsiteRemote(listOnsiteRemote) {
        this.listOnsiteRemote = listOnsiteRemote.content;
        this.paginationInfor = listOnsiteRemote
        this.paginationInfor.pageSize = listOnsiteRemote.pageable.pageSize
        this.paginationInfor.number = listOnsiteRemote.pageable.pageNumber
    }

    pageEventChange(pageSize) {
        this.changePageSize = pageSize;
    }

    pageChangeEventChange(pageChangeEvent) {
        this.changePage = pageChangeEvent;
    }

    updateOnsiteRemoteEvent(event) {
        if (event) {
            this.updateOnsiteRemoteNumber = ++this.updateOnsiteRemoteNumber;
        }
    }
}
