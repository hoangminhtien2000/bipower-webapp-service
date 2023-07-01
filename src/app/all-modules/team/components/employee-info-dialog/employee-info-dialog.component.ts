import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {take} from "rxjs/operators";
import {Employee} from "../../../../core/models/team.model";
import {BsModalRef} from "ngx-bootstrap/modal";
import {TeamService} from "../../../../core/services/team.service";

declare const $;
@Component({
    selector: 'app-employee-info-dialog',
    templateUrl: './employee-info-dialog.component.html',
    styleUrls: ['./employee-info-dialog.component.css']
})
export class EmployeeInfoDialogComponent implements OnInit, OnChanges{

    @Input() employeeID: number;
    employeeInfo: Employee;
    cvFile = '';

    constructor(private teamService: TeamService,
                private modalRef: BsModalRef) {
    }

    ngOnInit(): void {
        this.getEmployeeInfo(this.employeeID);
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    getEmployeeInfo(employeeID: number): void {
        this.teamService.getEmployeeInfo(employeeID).pipe(
            take(1)
        ).subscribe(response => {
            const split = this.cvFile = (response.data.cvViLink || '').split('/');
            this.cvFile = split[split.length - 1];
            this.employeeInfo = response.data;
        })
    }

    closeDialog(): void {
        this.modalRef.hide();
    }

}
