import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    AfterViewInit
} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {PresenceManagementService} from "../../../../../../core/services/presence-management.service";

@Component({
    selector: 'app-list-employee-search-form',
    templateUrl: './list-employee-search-form.component.html',
    styleUrls: ['./list-employee-search-form.component.scss']
})
export class ListEmployeeSearchFormComponent implements OnInit, AfterViewInit {
    searchEmployeeList: FormGroup
    workingStatus = PresenceManagementService.workingStatuses;
    status = 'DEFAULT';
    @Input() totalEmployeeWorkingStatusChild: string = "";
    employeeListData: Array<any>;
    @Output() searchingStatus = new EventEmitter<any>()
    public stringSearch = "";

    constructor() {
    }

    ngOnInit(): void {
    }

    searchingFullName(fullName) {
        this.stringSearch = fullName.target.value;
        // const listDataWithSearch = this.employeeListData.filter(item => item['fullName'] !== undefined && item['fullName'] !== null && item['fullName'].includes(stringSearch));
        this.searchingStatus.emit({stringSearch: this.stringSearch, status: this.totalEmployeeWorkingStatusChild})
    }

    selectedStatus(status) {
        this.totalEmployeeWorkingStatusChild = status.target.value;
        this.searchingStatus.emit({stringSearch: this.stringSearch, status: this.totalEmployeeWorkingStatusChild})
    }

    addFocusInput() {
        document.getElementById('text-focus').focus();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.addFocusInput();
        }, 0);
    }
}
