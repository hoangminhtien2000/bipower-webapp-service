import {AfterViewInit, Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {PresenceManagementService} from "../../../../../../core/services/presence-management.service";

@Component({
    selector: 'app-list-employee-summary-search-form',
    templateUrl: './list-employee-summary-search-form.html',
    styleUrls: ['./list-employee-summary-search-form.scss']
})
export class ListEmployeeSummarySearchForm implements OnInit, AfterViewInit {
    searchEmployeeList: FormGroup
    workingStatus = PresenceManagementService.workingStatuses;
    status = 'DEFAULT';
    @Input() totalEmployeeWorkingStatusChild: string = "";
    @Input() listPresence;
    employeeListData: Array<any>;
    @Output() searchingStatus = new EventEmitter<any>()
    public stringSearch = "";

    constructor(private _formBuilder: FormBuilder,
        private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.initializationForm()
    }

    initializationForm() {
        this.searchEmployeeList = this._formBuilder.group({
            fullName: [""],
            totalEmployeeWorkingStatusChild: [this.totalEmployeeWorkingStatusChild],
        })
    }

    ngOnChanges() {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.addFocusInput();
        }, 0);
    }

    searchingFullName(event: any) {
        this.stringSearch = event.target.value;
        this.searchingStatus.emit({stringSearch: this.stringSearch, status: this.totalEmployeeWorkingStatusChild})
    }

    selectedStatus(status) {
        this.totalEmployeeWorkingStatusChild = status.target.value;
        this.searchingStatus.emit({stringSearch: this.stringSearch, status: this.totalEmployeeWorkingStatusChild})
    }

    addFocusInput() {
        document.getElementById('text-focus').focus();
    }
}
