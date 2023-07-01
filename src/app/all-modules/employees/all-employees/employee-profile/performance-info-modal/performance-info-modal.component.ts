import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ROLE_LIST } from "src/app/core/common/constant";
import { TeamInfoI, TeamRoleInfoI } from "src/app/core/models/response/employeeResponse.model";
import { RoleResponseI } from "src/app/core/models/response/oauth.response.model";
declare const $: any;

@Component({
    selector: "app-performance-info-modal",
    templateUrl: "./performance-info-modal.component.html",
    styleUrls: ["./performance-info-modal.component.css"],
})
export class PerformanceInfoModalComponent implements OnInit, OnChanges, AfterViewInit {
    public form: FormGroup;
    @Input()
    public idModal: string =  "performance-info-modal";
    @Input()
    public employeeId: string =  "";
    @Input() value: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();

    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
    ) { }

    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static'
        });
        modal?.on('show.bs.modal', () => {
            this.generateForm();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes){
            
        }
    }

    ngOnInit() {
        this.generateForm();
    }

    generateForm() {
        this.form = this.formBuilder.group({
            employeeId: [this.employeeId ? this.employeeId : "", [Validators.required]],
            effort: [this.value ? this.value.effort : "", [Validators.required, Validators.min(0)]],
            netSalary: [this.value ? this.value.netSalary : "", [Validators.required]]
        })
    }

    onClickCancel() {
        $("#" + this.idModal).modal("hide");
    }

    onClickButtonSave() {
        this.form.markAllAsTouched();
        if(this.form.valid){
            let result = {};
            let rawData= this.form.value;

            for(let key in rawData){
                if(typeof rawData[key] == 'string'){
                    result[key] = parseInt(rawData[key].replace(/,/gi, ""));
                }else{
                    result[key] = rawData[key];
                }
            }
            this.onSubmit.emit(result);
        }
    }

}
