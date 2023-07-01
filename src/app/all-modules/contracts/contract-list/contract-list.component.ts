import { TranslateService } from '@ngx-translate/core';
import {DatePipe} from "@angular/common";
import {EmployeeService} from 'src/app/core/services/employee.service';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableDirective} from "angular-datatables";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {AllModulesService} from "../../all-modules.service";
import {ContractService, ENUM, EnumStoredService} from "../../../core";
import {CustomeDateNotEqualValidators, validateMaxCurrentDate, validDateCustom} from "src/app/core/helper/validator-custom/ValidatorCustom";
import {ROLE_LIST} from "../../../core/common/constant";
import {UserStorage} from "../../../core/storage/user.storage";

declare const $: any;
@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css']
})
export class ContractListComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe("en-US");
  public url: any = "contract";
  public tempId: any;
  public editId: any;
  public addContractForm: FormGroup;
  public editContractForm: FormGroup;
  public assigneeForm: FormGroup;
  public searchForm: FormGroup;
  public lstContract = [];
  public editedvalue;
  public btnSearchIsClicked = false;
  public txtEmployeeName = "";
  public txtSearchBirthday = "";
  public selectedRole = "";
  public pageSize = 10;
  public pageIndex = 0;
  public totalElements = 0;
  public numberOfElements = 0;
  public first = false;
  public last = false;
  public pageArr = [];
  public totalPages = 0;
  public currentDate = new Date();
  public rows = [];
  public srch = [];
  public genderTypes: any[] = [];
  public maritalStatuses: any[] = [];
  public roleContracts: any[] = [];
  public stackContracts: any[] = [];
  public stackLevelContracts: any[] = [];
  public englishLevelContracts: any[] = [];
  public social_contract_modal = 'social-contract-modal';
  public employees = [];
  public selectedContract = null;
  public contractStatuses = [
    {value: "PENDING", desc: "contract.search.create", key:"contract.search.create"},
    {value: "WAITING_APPROVE", desc: "contract.search.waitingApprove", key: "contract.search.waitingApprove"},
    {value: "UNAPPROVE", desc: "contract.search.unapprove", key: "contract.search.unapprove"},
    {value: "EFFECT", desc: "contract.search.effect", key: "contract.search.effect"},
    {value: "EXPIRED", desc: "contract.search.expired", key: "contract.search.expired"},
  ]


  public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
  public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
  public list_QC : any= ["QC", "HR"];
  public isDisabled = false;
  public textPattern = "[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$"
  public preValueFormSearch = null;
  public checkAll: Boolean = false;
  public isLoad = false;
  roles = this.userStorage.getUserRoles();

  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private contractService: ContractService,
    private enumStoredService: EnumStoredService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userStorage: UserStorage,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
          return this.onClickEditShowModal(params.id)}
        })
  }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    $("#add_contract").modal({
        backdrop: 'static',
        keyboard: false
    });
    // Floating Label
    this.searchForm = this.formBuilder.group({
      contractCode: ["", [Validators.maxLength(30)]],
      employeeName: ["", [Validators.maxLength(50)]],
      employeeCode: ["", [Validators.maxLength(50)]],
      contractType:[""],
      status:[""],
      createdDate:["", [CustomeDateNotEqualValidators.rangeDate()]],
      endDate:["", [CustomeDateNotEqualValidators.rangeDate()]],
      terminationDate:["", [CustomeDateNotEqualValidators.rangeDate()]],
    });

    this.assigneeForm = this.formBuilder.group({
      hrId: ["", [Validators.required]],
      roleType: ["", [Validators.required]],
    });

     this.contractService.getPageSearch({ size: 10000, page: 0})
    .subscribe(values => {
     this.employees = values.content;
    }, (error: any) => {});
    
    this.dtOptions = {
      pageLength: this.pageSize,
      dom: "lrtip",
      retrieve: true,
      paging: false,
      info: false,
      ordering: false,
      language: {
        emptyTable: "Không tìm thấy bản ghi",
        loadingRecords: "Không tìm thấy bản ghi",
        zeroRecords: "Không tìm thấy bản ghi",
      }
    };

    this.setDefaultDataFormAdd();

    this.editContractForm = this.formBuilder.group({
      EmailName: ["", [Validators.required]],
      CreateName: ["", [Validators.required]],
      PhoneName: ["", [Validators.required]],
    });
    const id: number = this.route.snapshot.queryParams.id;
    if(id){
      this.onClickEditShowModal(id, this.social_contract_modal);
    }
    this.onClickBtnSearch();
  }
  // Get department list  Api Call
  LoadContract(changePageSize: any = null, changePageIndex: any = null) {
    if(this.isLoad){
      return;
    }
    this.isLoad = true;
    let dataInput: any = Object.assign({}, this.searchForm.value);
    this.searchForm.markAllAsTouched();
    if(this.searchForm.valid){
      this.checkAll = false;
      if((changePageSize == null && changePageIndex == null)){
        if(!dataInput.roleType){
          dataInput.roleType = null
        }
        if(dataInput.createdDate){
          dataInput.startDateFrom = this.datePipe.transform(dataInput.createdDate[0], 'dd/MM/yyyy');
          dataInput.startDateTo = this.datePipe.transform(dataInput.createdDate[1], 'dd/MM/yyyy');
        }else{
          dataInput.startDateFrom = null;
          dataInput.startDateTo = null;
        }
        if(dataInput.endDate){
          dataInput.endDateFrom = this.datePipe.transform(dataInput.endDate[0], 'dd/MM/yyyy');
          dataInput.endDateTo = this.datePipe.transform(dataInput.endDate[1], 'dd/MM/yyyy');
        }else{
          dataInput.endDateFrom = null;
          dataInput.endDateTo = null;
        }
        if(dataInput.terminationDate){
          dataInput.contractTerminationDateFrom = this.datePipe.transform(dataInput.terminationDate[0], 'dd/MM/yyyy');
          dataInput.contractTerminationDateTo = this.datePipe.transform(dataInput.terminationDate[1], 'dd/MM/yyyy');
        }else{
          dataInput.contractTerminationDateFrom = null;
          dataInput.contractTerminationDateTo = null;
        }
        if (this.pageSize>=0) {
          dataInput.size = this.pageSize;
        }
        if(!dataInput.name){
          dataInput.name = null;
        }
        if(!dataInput.stack){
          dataInput.stack = null;
        }
        if (this.pageIndex >= 0) {
          dataInput.page = this.pageIndex > 1 ? this.pageIndex - 1: 0;
        }
        this.preValueFormSearch = dataInput;
      }else{
        dataInput = this.preValueFormSearch;
        if(changePageSize == true){
          if (this.pageSize>=0) {
            dataInput.size = this.pageSize;
          }
        }
        if(changePageIndex == true){
          if (this.pageIndex >= 0) {
            dataInput.page = this.pageIndex > 1 ? this.pageIndex - 1: 0;
          }
        }else{
          dataInput.page = 0;
          this.pageIndex = 0;
        }
      }
      let fieldNames = ['status', 'contractType']
      for(let key of fieldNames){
        if(!dataInput[key]){
          dataInput[key] = null
        }
      }
      delete dataInput['createdDate'];
      this.contractService.getPageSearch(dataInput, this.listHeaderStatus, this.listFieldName).subscribe((result: any) => {
        let data = result.data;
        this.lstContract = data.content;
        this.rows = this.lstContract;
        this.totalPages = data.totalPages;
        this.pageArr = Array(this.totalPages).fill(0).map((_, i) => i + 1);
        this.totalElements = data.totalElements;
        this.numberOfElements = data.numberOfElements;
        this.last = data.last;
        this.first = data.first;
        this.updateStatusCheckedAll(false);
        this.isLoad = false;
        this.dtTrigger.next();
      },
        err => {
          this.isLoad = false;
          this.toastr.error(err.error?.title, "Lỗi");
        });
    }
  }
  onClickBtnSearch(){
    this.searchForm.markAllAsTouched();
    const controls = this.searchForm.controls;
    const invalid = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    if(this.searchForm.valid){
      this.pageIndex = 0;
      this.LoadContract();
    }
  }
  // input searchName 
  searchName(newVal) {
    this.txtEmployeeName = newVal;
  }

  pageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.LoadContract(true, true);
  }

  rerender() {

  }
  onSubmit() {
    this.addContractForm.markAllAsTouched();
    const invalid = [];
    const controls = this.addContractForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    if (this.addContractForm.valid) {
      const obj = Object.assign({}, this.addContractForm.value);
      delete obj["cvFile"];
      delete obj["avatarFile"];
      obj.contractDay = this.datePipe.transform(obj.contractDay, 'dd/MM/yyyy');
      if(obj.workingTimeFrom){
        obj.workingTimeFrom = obj.workingTimeFrom.getTime();
      }else{
        obj.workingTimeFrom = null;
      }
      if(obj.workingTimeWithStackFrom){
        obj.workingTimeWithStackFrom = obj.workingTimeWithStackFrom.getTime();
      }else{
        obj.workingTimeWithStackFrom = null;
      }
      if(obj.roleType && this.list_QC.indexOf(obj.roleType.trim())>=0){
        obj.stack = "";
        obj.workingTimeWithStackFrom = null;
      }
      const formData: FormData = new FormData();
      formData.append('cvFile', this.addContractForm.value.cvFile);
      formData.append('avatarFile', this.addContractForm.value.avatarFile);
      formData.append('candidateJsonData', JSON.stringify(obj));
      this.contractService.create(formData).subscribe((result: any) => {
        let { data } = result;
        if(result && result.success == false){
          this.toastr.success(result.message, "Lỗi");
        }else if(result && result.success){
          this.toastr.success("Tạo mới thành công!", "Thông báo");
          $("#add_candidate").modal('hide');
          this.router.navigateByUrl(`/layout/candidate/candidateprofile?id=${data.id}`);
        }
        // this.LoadCandidate();
      }, ({error}) => {
        this.toastr.error(error.detail || error.title, "Lỗi");
      });
    }


  }
  
  async fileChangeAvatar(files: any) {
    if (files && files[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("thumbnail", files[0]);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const imgBase64Path = e.target.result;
            this.avatarBase64 = imgBase64Path;
          };
        };
        reader.readAsDataURL(file);
      }
    }
  }
  onChangeCvFile(event){
  }

  // Add questions  Modal Api Call
  // addContract() {
  //   if (this.addContractForm.valid) {
  //     let obj = {
  //       email: this.addContractForm.value.EmailName,
  //       createddate: this.addContractForm.value.CreateName,
  //       mobilenumber: this.addContractForm.value.PhoneName,
  //       id: 0,
  //       name: "John Doe",
  //     };
  //     this.srvModuleService.add(obj, this.url).subscribe((data) => {
  //       this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         dtInstance.destroy();
  //       });
  //     });
  //     this.LoadContract();
  //     $("#add_employee").modal("hide");
  //     this.addContractForm.reset();
  //     this.toastr.success("Add contract added sucessfully...!", "Success");
  //   }
  // }

  setDefaultDataFormAdd(){
    this.avatarBase64 = this.AVATAR_DEFAULT;
    $("#cvFileAdd").val('');
    this.addContractForm = this.formBuilder.group({
      contractCode: ["", [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
      employeeName: ["", [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
      contractDay: ["", [Validators.required, validDateCustom, validateMaxCurrentDate]],
      contractType:["", [Validators.required]],
      status:["", [Validators.required]],
    });
    this.isDisabled = false;
  }

  onAddContract(){
    this.addContractForm.reset(); 
    this.setDefaultDataFormAdd();
    $("#add_contract").modal("show");
    setTimeout(function(){
      $("#contractCodeEdit").trigger("focus"); 
    }, 500);
  }

  editContract() {
    if (this.editContractForm.valid) {
      let obj = {
        email: this.editContractForm.value.EmailName,
        createddate: this.editContractForm.value.CreateName,
        mobilenumber: this.editContractForm.value.PhoneName,
        id: this.editId,
        name: "John Doe",

      };
      this.srvModuleService.update(obj, this.url).subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });

      });
      this.LoadContract(true);
      $("#edit_job").modal("hide");
      this.toastr.success("Edit job Updated sucessfully...!", "Success");
    }
  }

  // To Get The department Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editedvalue = value.email
    this.editId = value.id;
    const index = this.lstContract.findIndex((item) => {
      return item.id === value.id;
    });
    let toSetValues = this.lstContract[index];
    this.editContractForm.setValue({
      EmailName: toSetValues.email,
      CreateName: toSetValues.createddate,
      PhoneName: toSetValues.mobilenumber,
    });
  }

  deleteContract() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });

      this.LoadContract(true);
      $("#delete_job").modal("hide");
      this.toastr.success("contract deleted sucessfully..!", "Success");
    });
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onClickPagination(index: number): void{
    if(index >= 0 && this.pageIndex != index){
      this.pageIndex = index;
      this.LoadContract(true, true);
    }
  }
  onClickPaginationPrev(): void{
    if(!this.first){
      this.pageIndex = 0;
      this.LoadContract(true, true);
    }
  }
  onClickPaginationNext(): void{
    if(!this.last){
      this.pageIndex = Math.ceil(this.totalElements / this.pageSize);
      this.LoadContract(true, true);
    }
  }
  onChangePageSize(page): void{
    this.pageSize = parseInt(page);
    this.LoadContract(true);
  }

  get isHidden(){
    return this.totalElements > 0;
  }

  onKeyInputNumber(event: any){
    if("0123456789".indexOf(event.key) < 0){
      event.preventDefault();
    }
  }

  onChangeRole(){
    if(this.list_QC.indexOf(this.addContractForm.value.roleType.trim()) >= 0){
      this.addContractForm.get('stack').clearValidators();
      this.addContractForm.get('stack')?.updateValueAndValidity();
      this.addContractForm.get('stack').reset("");
      this.addContractForm.get('workingTimeWithStackFrom').clearValidators();
      this.addContractForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom')?.reset("");
      this.isDisabled = false;
    }else{
      this.addContractForm.get('stack').setValidators([Validators.required]);
      this.addContractForm.get('stack')?.updateValueAndValidity();
      this.addContractForm.get('stack').reset("");
      this.addContractForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
      this.addContractForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom').reset("");
      this.isDisabled = true;
    }
  }


  getContractCode(id: number = 0){
    return "UV" + (id + "").padStart(4, "0");
  }

  onBlur(fieldName: string) {
    if(this.addContractForm.value && typeof this.addContractForm.value[fieldName] == "string"){
      this.addContractForm.setValue({ ...this.addContractForm.value, [fieldName]: this.addContractForm.value[fieldName].trim() });
    }
  }

  onBlurSearch(fieldName: string) {
    if(this.searchForm.value && typeof this.searchForm.value[fieldName] == "string"){
      this.searchForm.setValue({ ...this.searchForm.value, [fieldName]: this.searchForm.value[fieldName].trim() });
    }
  }

  onKeypress(event) {
    if(event.keyCode == 13){
      this.LoadContract();
    }
  }

  updateStatusCheckedAll(value: any = false){
    if(this.lstContract && this.lstContract.length >= 0){
      this.lstContract.forEach(element => {
        element.checked = value;
      });
    }
  }

  onClickCheckBox(event: any, index: number) {
    if(index == -1){
        if(event.target.checked == true){
          this.checkAll = true;
          this.updateStatusCheckedAll(true);
        }else{
          this.checkAll = false;
          this.updateStatusCheckedAll(false);
        }
    }else{
      this.lstContract[index].checked = event.target.checked;
      const finder = this.lstContract.find(el => el.checked == false);
      if(finder){
        this.checkAll = false;
      }else{
        this.checkAll = true;
      }

    }
  }

  onClickAssignee() {
    $("#assignee_contract").modal("show");
    this.assigneeForm = this.formBuilder.group({
      hrId: ["", [Validators.required]],
      roleType: ["", [Validators.required]],
    });
  }

  onClickShowModal(idModal: string) {
    this.selectedContract = null;
    $("#" + idModal).modal("show");
  }

  onClickEditShowModal(id: number, idModal: string = '') {
    this.contractService.findById(id).subscribe(result => {
      if(result && result.data){
        $("#" + idModal).modal("show");
        this.selectedContract = result.data;
      }
    }, error => {

    });
  }

  onSubmitContract(data: any = null) {
    if(data.contractTerminationDate){
      data.contractTerminationDate = this.datePipe.transform(data.contractTerminationDate, 'dd/MM/yyyy');
    }
    if(data.startDate){
      data.startDate = this.datePipe.transform(data.startDate, 'dd/MM/yyyy');
    }
    if(data.endDate){
      data.endDate = this.datePipe.transform(data.endDate, 'dd/MM/yyyy');
    }
    const formData = new FormData();

    if(data.id){
      if(data.laborContractPath){
        formData.append("contractFile", data.laborContractPath);
      }
      for(let key in data){
        if(!data[key]){
          delete data[key];
        }
      }
      if(data['laborContractPath']){
        delete data['laborContractPath'];
      }
      formData.append("request", new Blob([JSON.stringify(data)], {
        type: 'application/json'
      }));
      this.contractService.update(formData, data.id).subscribe(({body}: any) => {
        if(body && body.success){
          this.toastr.success("Cập nhật dữ liệu thành công", "Thông báo");
          this.pageIndex = 0;
          this.LoadContract();
          $("#" + this.social_contract_modal).modal("hide");
        }else if(body && body.success == false){
          this.toastr.error(body.message, "Lỗi");
        }
      }, (error) => {
        // this.toastr.error(this.enumStoredService.getMessageError(error, 'title'), "Lỗi");
      })
    }else{
      if(data.laborContractPath){
        formData.append("contractFile", data.laborContractPath);
      }
      for(let key in data){
        if(!data[key]){
          delete data[key];
        }
      }
      if(data['laborContractPath']){
        delete data['laborContractPath'];
      }
      formData.append("createLaborContractReq", new Blob([JSON.stringify(data)], {
        type: 'application/json'
      }));
      this.contractService.create(formData).subscribe(({body}: any) => {
        if(body && body.success){
          this.toastr.success("Cập nhật dữ liệu thành công", "Thông báo");
          this.pageIndex = 0;
          this.LoadContract();
          $("#" + this.social_contract_modal).modal("hide");
        }else if(body && body.success == false){
          this.toastr.error(body.message, "Lỗi");
        }
      }, (error) => {
        // this.toastr.error(this.enumStoredService.getMessageError(error, 'title'), "Lỗi");
      })
    }
  }

  onApproveContract(data: any = null) {
    if(data.contractTerminationDate){
      data.contractTerminationDate = this.datePipe.transform(data.contractTerminationDate, 'dd/MM/yyyy');
    }
    if(data.startDate){
      data.startDate = this.datePipe.transform(data.startDate, 'dd/MM/yyyy');
    }
    if(data.endDate){
      data.endDate = this.datePipe.transform(data.endDate, 'dd/MM/yyyy');
    }
    const body = {
      status: data.status,
      note: data.note,
      laborContractDTO: data
    };
    this.contractService.updateStatus(body, data.id).subscribe((result : any) => {
      if(result.status == 200){
        this.toastr.success("Cập nhật dữ liệu thành công", "Thông báo");
        this.pageIndex = 0;
        this.LoadContract();
        $("#" + this.social_contract_modal).modal("hide");
      }
    }, (error) => {
      // "error.not.allowed.status"
      this.toastr.error(error.error.message, "Lỗi");
    })
  }

  onSubmitAssingee() {

  }

  getContractStatus(status) {
    let contractStatus = this.contractStatuses.find(ctr => ctr.value === status);
    return this.translate.instant(contractStatus.desc);
  }

  public listFieldName = ["fullName", "contractCode", "startDate", "contractTerm", "endDate", "contractTerminationDate", "status"];
  public listHeaderStatus = Array(this.listFieldName.length).fill(null);
  getClassSort(index: number){
    return { 
      'sorting_asc': this.listHeaderStatus[index] == null ? true : !this.listHeaderStatus[index], 
      'sorting_desc': this.listHeaderStatus[index] == null ? true : !!this.listHeaderStatus[index] 
    };
  }
  clickSortIcon(index: number) {
    if(this.listHeaderStatus[index] == null){
      this.listHeaderStatus[index] = true;
    }else if(this.listHeaderStatus[index] == true){
      this.listHeaderStatus[index] = false;
    } else if(this.listHeaderStatus[index] == false){
      this.listHeaderStatus[index] = null;
    }

    
    this.LoadContract(true, true);
  }

  canSearchContract() {
    let hasPermission = this.roles.filter(role =>
        role.code === ROLE_LIST.PRODUCT_OWNER||
        role.code === ROLE_LIST.TEAM_LEADER ||
        role.code === ROLE_LIST.C_B ||
        role.code === ROLE_LIST.COO);
    return hasPermission.length > 0;
  }

  canAddNewContract() {
    let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.C_B);
    return hasPermission.length > 0;
  }

  canSeeContractDetail() {
    let hasPermission = this.roles.filter(role =>
        role.code === ROLE_LIST.C_B ||
        role.code === ROLE_LIST.COO ||
        role.code === ROLE_LIST.CTO ||
        role.code === ROLE_LIST.CFO||
        role.code === ROLE_LIST.CMO);
    return hasPermission.length > 0;
  }
}
