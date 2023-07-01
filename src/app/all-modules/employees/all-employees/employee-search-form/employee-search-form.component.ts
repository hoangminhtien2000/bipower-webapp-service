import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EnumStoredService} from "src/app/core/services/enum.service";
import {Router} from "@angular/router";
import {POSITION_EMPLOYEE, ROLE_LIST} from "src/app/core/common/constant";
import {TeamService} from "../../../../core/services/team.service";
import {UserStorage} from "../../../../core/storage/user.storage";

@Component({
    selector: "app-employee-search-form",
    templateUrl: "./employee-search-form.component.html",
    styleUrls: ["./employee-search-form.component.css"],
})
export class EmployeeSearchFormComponent implements OnInit {
    public searchEmployeeForm: FormGroup;
    @Input() fullName = '';
    @Input() employeeCode = '';
    @Input() position = '';
    @Input() companyEmail = '';
    @Input() teamId = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onExport = new EventEmitter<any>();
    @Input()
    public positionList: any[] = [];
    teams = [];
    public currentDate: any = new Date();
    @Input()
    public EMPLOYEE_STATUS: any = [];
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));

    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router,
        private enumService: EnumStoredService,
        private teamService: TeamService,
        private userStorage: UserStorage
    ) {
    }

    ngOnInit() {
        this.fetchDepartments();
        this.positionList = POSITION_EMPLOYEE;
        this.searchEmployeeForm = this.formBuilder.group({
            fullName: ["", [Validators.maxLength(200)]],
            employeeCode: ["", [Validators.maxLength(20)]],
            position: ["", []],
            companyEmail: ["", [Validators.maxLength(100)]],
            teamId: ["", []],
            status: ["", []]
        });
        this.searchEmployeeForm.setValue({
            fullName: this.fullName,
            employeeCode: this.employeeCode,
            position: this.position,
            companyEmail: this.companyEmail,
            teamId: this.teamId,
            status: ""
        })
    }

    fetchDepartments() {
        this.teamService.getTeams().subscribe(res => {
            if (res.success) {
                this.teams = res.data;
            } else {
                this.toastr.error(res.message())
            }
        }, error => {
            this.toastr.error(error.error?.title, "Lỗi")
        })
    }
    onKeypress(event) {
        if (event.keyCode == 13) {
            this.onClickBtnSearch();
        }
    }
    onClickBtnSearch() {
        this.searchEmployeeForm.markAllAsTouched();
        if (this.searchEmployeeForm.valid) {
            this.onSubmit.emit(this.searchEmployeeForm.value);
        } else {

        }
    }

    onBlurSearch(fieldName: string) {
        if (this.searchEmployeeForm.value && typeof this.searchEmployeeForm.value[fieldName] == "string") {
            this.searchEmployeeForm.setValue({
                ...this.searchEmployeeForm.value,
                [fieldName]: this.searchEmployeeForm.value[fieldName].trim()
            });
        }
    }

    onClickExport() {
        this.searchEmployeeForm.markAllAsTouched();
        if (this.searchEmployeeForm.valid) {
            this.onExport.emit(this.searchEmployeeForm.value);
        }
    }

    onClickImport() {
        this.router.navigate(['/layout/employees/import']);
    }

    canImportEmployee() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    canExportEmployee() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    keyupEnter(event) {
        this.onClickBtnSearch();
    }
}
