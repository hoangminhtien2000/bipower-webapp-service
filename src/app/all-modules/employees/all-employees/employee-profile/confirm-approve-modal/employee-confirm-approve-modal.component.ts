import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeConfirmI } from "src/app/core/models/response/employeeResponse.model";
declare const $: any;

@Component({
    selector: "app-employee-confirm-approve-modal",
    templateUrl: "./employee-confirm-approve-modal.component.html",
    styleUrls: ["./employee-confirm-approve-modal.component.css"],
})
export class EmployeeConfirmApproveModalComponent implements OnInit, AfterViewInit {
    public idEntityInformationForm: FormGroup;
    public objectListForm: FormGroup;
    @Input()
    public idModal: string =  "confirm-approve-modal";
    @Input() value: any = [];
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();

    @Input()
    public title: string = 'Confirm approve';
    @Input()
    public content: string = '';


    public currentDate = new Date();
    constructor() {}
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            
        })
    }

    ngOnInit() {}

    onCancel() {
        $("#" + this.idModal).modal('hide');
    }

    onSave() {
        let data: EmployeeConfirmI = {
            isApproval: true
        };
        this.onSubmit.emit(data);
    }

}
