import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AllModulesService} from "src/app/all-modules/all-modules.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {EmployeeService} from "../../../../core/services/employee.service";
import {EnumStoredService} from "src/app/core/services/enum.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MIME_TYPE, POSITION_EMPLOYEE, ROLE_LIST} from "../../../../core/common/constant";
import { CatalogService, CATALOG_CODE } from "src/app/core/services/catalog.service";
import { FileService } from "src/app/core/services/file.service";
import * as FileSaver from 'file-saver';
import {UserStorage} from "../../../../core/storage/user.storage";

declare const $: any;

@Component({
    selector: "app-employee-list",
    templateUrl: "./employee-list.component.html",
    styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
    public dtOptions: DataTables.Settings = {
        pageLength: 5,
        dom: "lrtip",
        retrieve: true,
        paging: false,
        info: false,
        ordering: false,
    };
    public rows: any = [];
    public totalPages = 0;
    public pageArr = [];
    public totalElements = 0;
    public numberOfElements = 0;
    public last = false;
    public first = false;
    public pageSize = 10;
    public pageIndex = 0;
    public lstEmployee = [];
    public employee_modal_id = 'add_empployee';
    public employee_modal_view_id = 'add_empployee_view';
    public isLoad = false;
    public POSITION_EMPLOYEE_MAP: any = [];
    public EMPLOYEE_STATUS: any = [];
    public GENDER: any = [];
    public TECHNOLOGY: any = [];

    public searchParams: any = {
        page: 0,
        size: 10,
        fullName: "",
        birthday: "",
        roleType: "",
    };
    @ViewChild(DataTableDirective, {static: false})
    public dtElement: DataTableDirective;
    public url: any = "employeelist";
    public tempId: any;
    public editId: any;

    public addEmployeeForm: FormGroup;
    public editEmployeeForm: FormGroup;

    public pipe = new DatePipe("en-US");
    public srch = [];
    public statusValue;
    public dtTrigger: Subject<any> = new Subject();
    public DateJoin;
    public preValueFormSearch: any = null;
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    companyEmail = JSON.parse(localStorage.getItem('USER_INFO')).email;

    constructor(
        private srvModuleService: AllModulesService,
        private employeeService: EmployeeService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        private catalogService: CatalogService,
        private fileService: FileService,
    ) {
    }

    public employeeSelected: any = null;

    ngOnInit() {
        // for floating label

        $(".floating")
            .on("focus blur", function (e) {
                $(this)
                    .parents(".form-focus")
                    .toggleClass("focused", e.type === "focus" || this.value.length > 0);
            })
            .trigger("blur");
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_POSITION).subscribe(result => {
            if(result.data){
                this.POSITION_EMPLOYEE_MAP = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_STATUS).subscribe(result => {
            if(result.data){
                this.EMPLOYEE_STATUS = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.GENDER).subscribe(result => {
            if(result.data){
                this.GENDER = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.TECHNOLOGY).subscribe(result => {
            if(result.data){
                this.TECHNOLOGY = result.data;
            }
        })
        this.loadEmployee();
        // add employee form validation
        this.addEmployeeForm = this.formBuilder.group({
            FirstName: ["", [Validators.required]],
            LastName: ["", [Validators.required]],
            UserName: ["", [Validators.required]],
            Password: ["", [Validators.required]],
            ConfirmPassword: ["", [Validators.required]],
            DepartmentName: ["", [Validators.required]],
            Designation: ["", [Validators.required]],
            Email: ["", [Validators.required]],
            PhoneNumber: ["", [Validators.required]],
            JoinDate: ["", [Validators.required]],
            CompanyName: ["", [Validators.required]],
            EmployeeID: ["", [Validators.required]],
        });

        // edit form validation
        this.editEmployeeForm = this.formBuilder.group({
            FirstName: ["", [Validators.required]],
            LastName: ["", [Validators.required]],
            UserName: ["", [Validators.required]],
            Password: ["", [Validators.required]],
            ConfirmPassword: ["", [Validators.required]],
            DepartmentName: ["", [Validators.required]],
            Designation: ["", [Validators.required]],
            Email: ["", [Validators.required]],
            PhoneNumber: ["", [Validators.required]],
            JoinDate: ["", [Validators.required]],
            CompanyName: ["", [Validators.required]],
            EmployeeID: ["", [Validators.required]],
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.dtTrigger.next();
        }, 1000);
        const id: number = this.route.snapshot.queryParams.id;
        this.confirmEmployee(this.employee_modal_view_id, {id: id});
    }

    rerender(): void {
    }

    onClickAddNew() {
        $("#" + this.employee_modal_id).modal("show");
    }

    onClose(data) {
    }

    // Get Employee  Api Call
    loadEmployee(changePageSize: any = null, changePageIndex: any = null) {
        if (this.isLoad) {
            return;
        }
        this.isLoad = true;
        let dataInput: any = Object.assign({}, this.searchParams);
        if ((changePageSize == null && changePageIndex == null)) {
            if (!dataInput.roleType) {
                dataInput.roleType = null
            }
            if (dataInput.birthday) {
                dataInput.birthday = this.datePipe.transform(dataInput.birthday, 'dd/MM/yyyy');
            } else {
                dataInput.birthday = null;
            }
            if (this.pageSize >= 0) {
                dataInput.size = this.pageSize;
            } else {
                dataInput.size = this.pageSize;
            }
            if (!dataInput.fullName) {
                dataInput.fullName = null;
            }
            if (this.pageIndex >= 0) {
                dataInput.page = this.pageIndex > 1 ? this.pageIndex - 1 : 0;
            } else {
                dataInput.page = this.pageIndex;
            }
            this.preValueFormSearch = dataInput;
        } else {
            dataInput = this.preValueFormSearch;
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
        if (!dataInput.status) {
            dataInput.status = null;
        }
        if (!dataInput.teamId) {
            dataInput.teamId = null;
        }
        this.employeeService.getPageSearch(dataInput, this.listHeaderStatus, this.listFieldName).subscribe(({ data }: any) => {
            this.isLoad = false;
            if (data && data.content) {
                this.lstEmployee = data.content.map(el => {
                    el.positionName = "";
                    if(el.position){
                        el.position.map((element, index) => {
                            if(index != 0) {
                                el.positionName += ",";
                            }
                            const finder = this.POSITION_EMPLOYEE_MAP.find(el => element == el.code);
                            el.positionName += finder ? finder.name : (element ? element : "");
                        });
                    }
                    return el;
                });
                this.rows = this.lstEmployee;
                this.srch = [...this.rows];
                this.totalPages = data.totalPages;
                this.pageArr = Array(this.totalPages).fill(0).map((_, i) => i + 1);
                this.totalElements = data.totalElements;
                this.numberOfElements = data.numberOfElements;
                this.last = data.last;
                this.first = data.first;
                this.srch = [...this.rows];
            } else {
                this.lstEmployee = [];
                this.rows = this.lstEmployee;
                this.srch = [...this.rows];
                this.totalPages = 0;
                this.pageArr = Array(this.totalPages).fill(0).map((_, i) => i + 1);
                this.totalElements = 0;
                this.numberOfElements = 0;
            }
        }, error => {
            this.isLoad = false;
        });
    }

    // Add employee  Modal Api Call
    addEmployee() {
        let DateJoin = this.pipe.transform(
            this.addEmployeeForm.value.JoinDate,
            "dd-MM-yyyy"
        );
        let obj = {
            firstname: this.addEmployeeForm.value.FirstName,
            lastname: this.addEmployeeForm.value.LastName,
            username: this.addEmployeeForm.value.UserName,
            email: this.addEmployeeForm.value.Email,
            password: this.addEmployeeForm.value.Password,
            confirmpassword: this.addEmployeeForm.value.ConfirmPassword,
            employeeId: this.addEmployeeForm.value.EmployeeID,
            joindate: DateJoin,
            phone: this.addEmployeeForm.value.PhoneNumber,
            company: this.addEmployeeForm.value.CompanyName,
            department: this.addEmployeeForm.value.DepartmentName,
            designation: this.addEmployeeForm.value.Designation,
            mobile: "9944996335",
            role: "Web developer",
        };
        this.srvModuleService.add(obj, this.url).subscribe((data) => {
            $("#datatable").DataTable().clear();
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
            });
            this.dtTrigger.next();
        });
        this.loadEmployee();
        $("#" + this.employee_modal_id).modal("hide");
        this.addEmployeeForm.reset();
        this.toastr.success("Employeee added sucessfully...!", "Success");
    }

    // to know the date picker changes
    from(data) {
        this.DateJoin = this.pipe.transform(data, "dd-MM-yyyy");
    }

    // edit modal api call
    editEmployee() {
        let obj = {
            firstname: this.editEmployeeForm.value.FirstName,
            lastname: this.editEmployeeForm.value.LastName,
            username: this.editEmployeeForm.value.UserName,
            email: this.editEmployeeForm.value.Email,
            password: this.editEmployeeForm.value.Password,
            confirmpassword: this.editEmployeeForm.value.ConfirmPassword,
            employeeId: this.editEmployeeForm.value.EmployeeID,
            joindate: this.editEmployeeForm.value.JoinDate,
            phone: this.editEmployeeForm.value.PhoneNumber,
            company: this.editEmployeeForm.value.CompanyName,
            department: this.editEmployeeForm.value.DepartmentName,
            designation: this.editEmployeeForm.value.Designation,
            mobile: "9944996335",
            role: "Web developer",
            id: this.editId,
        };
        this.srvModuleService.update(obj, this.url).subscribe((data1) => {
            $("#datatable").DataTable().clear();
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
            });
            this.dtTrigger.next();
        });
        this.loadEmployee();
        $("#edit_employee").modal("hide");
        this.toastr.success("Employeee Updated sucessfully...!", "Success");
    }

    // To Get The employee Edit Id And Set Values To Edit Modal Form
    edit(value) {
        this.editId = value;
        const index = this.lstEmployee.findIndex((item) => {
            return item.id === value;
        });
        let toSetValues = this.lstEmployee[index];
        this.editEmployeeForm.setValue({
            FirstName: toSetValues.firstname,
            LastName: toSetValues.lastname,
            UserName: toSetValues.username,
            Email: toSetValues.email,
            Password: toSetValues.password,
            ConfirmPassword: toSetValues.confirmpassword,
            EmployeeID: toSetValues.employeeId,
            JoinDate: toSetValues.joindate,
            PhoneNumber: toSetValues.phone,
            CompanyName: toSetValues.company,
            DepartmentName: toSetValues.department,
            Designation: toSetValues.designation,
        });
    }

    // delete employee data api call
    deleteEmployee() {
        this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
            $("#datatable").DataTable().clear();
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
            });
            this.dtTrigger.next();
        });
        this.loadEmployee();
        $("#delete_employee").modal("hide");
        this.toastr.success("Employee deleted sucessfully..!", "Success");
    }

    //search by Id
    searchId(val) {
        this.rows.splice(0, this.rows.length);
        let temp = this.srch.filter(function (d) {
            val = val.toLowerCase();
            return d.employeeId.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rows.push(...temp);
    }

    //search by name
    searchName(val) {
        this.rows.splice(0, this.rows.length);
        let temp = this.srch.filter(function (d) {
            val = val.toLowerCase();
            return d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rows.push(...temp);
    }

    //search by purchase
    searchByDesignation(val) {
        this.rows.splice(0, this.rows.length);
        let temp = this.srch.filter(function (d) {
            val = val.toLowerCase();
            return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rows.push(...temp);
    }

    //getting the status value
    getStatus(data) {
        this.statusValue = data;
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    onSearch(data: any) {
        this.searchParams = data;
        this.pageIndex = 0;
        this.loadEmployee();
    }

    onExportFile(data: any){
        if (this.isLoad) {
            return;
        }
        this.isLoad = true;
        let dataInput: any = Object.assign({}, data);
        if (!dataInput.roleType) {
            dataInput.roleType = null
        }
        if (dataInput.birthday) {
            dataInput.birthday = this.datePipe.transform(dataInput.birthday, 'dd/MM/yyyy');
        } else {
            dataInput.birthday = null;
        }
        if (this.pageSize >= 0) {
            dataInput.size = this.pageSize;
        } else {
            dataInput.size = this.pageSize;
        }
        if (!dataInput.fullName) {
            dataInput.fullName = null;
        }
        if (!dataInput.status) {
            dataInput.status = null;
        }
        if (!dataInput.teamId) {
            dataInput.teamId = null;
        }
        this.employeeService.getExport(dataInput).subscribe((ret: any) => {
            this.isLoad = false;
            if (ret) {
                const result = this.fileService.convertBase64ToBlob(ret.fileReport, MIME_TYPE.XLSX);
                let reader = new FileReader();
                reader.readAsDataURL(result);
                reader.onloadend = () => {
                    let base64data = reader.result;
                    FileSaver.saveAs(base64data, ret.fileName);
                }
            }
        }, error => {
            this.isLoad = false;
        });
    }

    get isHidden() {
        return this.totalElements > 0;
    }

    onChangePageSize(page): void {
        this.pageSize = parseInt(page);
        this.loadEmployee(true);
    }

    pageChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadEmployee(true, true);
    }

    onSaveAddNew(data) {
        const obj = Object.assign({}, data);
        delete obj["cvFile"];
        delete obj["avatarFile"];
        obj.birthday = this.datePipe.transform(obj.birthday, 'dd/MM/yyyy');

        if (obj.onboardDate) {
            obj.onboardDate = new Date(obj.onboardDate).getTime();
        } else {
            obj.onboardDate = 0;
        }
        if (obj.lastWorkingDate) {
            obj.lastWorkingDate = new Date(obj.lastWorkingDate).getTime();
        } else {
            obj.lastWorkingDate = 0;
        }
        if (obj.identityCardValidDate) {
            obj.identityCardValidDate = new Date(obj.identityCardValidDate).getTime();
        } else {
            obj.identityCardValidDate = 0;
        }

        const formData: FormData = new FormData();
        formData.append('avatarFile', data.avatarFile ? data.avatarFile : null);
        formData.append('employeeJsonData', JSON.stringify(obj));
        this.employeeService.create(formData).subscribe((res: any) => {
            if (res.success) {
                $("#" + this.employee_modal_id).modal("hide");
                this.toastr.success("Thêm mới thành công", "Lỗi")
                this.loadEmployee();
            } else if(res.success == false){

            }
        }, error => {
            
        });
    }

    getEmployeeStatus(status) {
        let result = this.EMPLOYEE_STATUS.find(el => el.code == status);
        if(result){
            return result.name;
        }
        return "";
    }

    confirmEmployee(modalId: string = '', selected: any = null) {
        if(selected?.id){
            this.employeeService.findById(selected?.id).subscribe(({data}: any) => {
                this.employeeSelected = data;
                if (data?.employeeStatus == "PENDING" || data?.employeeStatus == "REJECTED" || data?.employeeStatus == "RETIRED") {
                    $('#' + modalId).modal('show');
                }
            }, err => {});
        }
    }

    onSubmitConfirmEmployee(data: any = null) {
        const body = {
            isApproval: data.isApproval,
            note: data.note,
            employeeId: data.id
        }
        this.employeeService.updateStatus(body, data.id).subscribe(result => {
            if(result && result.success){
                if (data.status == "CONFIRMED") {
                    this.toastr.success("Xác nhận thành công", "Thông báo");
                    setTimeout(() => {
                        $("#" + this.employee_modal_view_id).modal('hide');
                        // window.location.href = `/layout/employees/employeeprofile?id=${data.id}`;
                        this.router.navigate(["/layout/employees/employeeprofile"], { queryParams: { id: data.id } })
                    }, 1000);
                } else {
                    $("#" + this.employee_modal_view_id).modal('hide');
                    this.loadEmployee();
                    this.toastr.success("Đã từ chối xác nhận ", "Thông báo");
                }
            }
        }, error => {
            this.toastr.error(error.error.error);
        })
    }

    public listFieldName = ["employeeCode", "fullName", "companyEmail", "department", "position", "status"];
    public listHeaderStatus = Array(this.listFieldName.length).fill(null);

    getClassSort(index: number) {
        return {
            'sorting_asc': this.listHeaderStatus[index] == null ? true : !this.listHeaderStatus[index],
            'sorting_desc': this.listHeaderStatus[index] == null ? true : !!this.listHeaderStatus[index]
        };
    }

    clickSortIcon(index: number) {
        if (this.listHeaderStatus[index] == null) {
            this.listHeaderStatus[index] = true;
        } else if (this.listHeaderStatus[index] == true) {
            this.listHeaderStatus[index] = false;
        } else if (this.listHeaderStatus[index] == false) {
            this.listHeaderStatus[index] = null;
        }
        this.loadEmployee(true, true);
    }

    canSeeEmployeeDetail(row) {
        if(this.companyEmail == row.companyEmail) return true;
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRODUCT_OWNER ||
            role.code === ROLE_LIST.TEAM_LEADER ||
            role.code === ROLE_LIST.C_B ||
            role.code === ROLE_LIST.COO
        );
        return hasPermission.length > 0;
    }

    onClickEmployeeProfile(row: any) {
        if(this.canSeeEmployeeDetail(row)){
            const url = this.router.createUrlTree(["/layout/employees/employeeprofile"], { queryParams: { id: row.id } });
            window.open(url.toString(), '_blank');
        }
    }

}
