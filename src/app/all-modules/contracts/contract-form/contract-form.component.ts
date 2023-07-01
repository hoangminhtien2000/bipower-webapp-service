import {DatePipe} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {environment} from "src/environments/environment";
import {ContractService, EducationService, ENUM, EnumStoredService, ExperienceService} from "../../../core";
import {
  CustomeDateValidators,
  validaPhoneNumber,
  validateMaxCurrentDate,
  validDateCustom,
  validFileMaxSize,
  validRequiredType,
  validRequiredTypeDoc
} from "src/app/core/helper/validator-custom/ValidatorCustom";

declare const $: any;
@Component({
  selector: "app-contract-form",
  templateUrl: "./contract-form.component.html",
  styleUrls: ["./contract-form.component.css"],
})
export class ContractFormComponent implements OnInit {
  public addContractForm: FormGroup;
  public eduInfoForm: FormGroup;
  public experienceForm: FormGroup;

  public id: number = 0;

  public profileInfo: any = {};
  public educationInfo: any[] = [];
  public expInfo: any[] = [];

  public educationInfoRemoved: any[] = [];
  public expInfoRemoved: any[] = [];

  public roleCandidates: any[] = [];
  public stackCandidates: any[] = [];
  public stackLevelCandidates: any[] = [];
  public degreeList: any[] = [];

  public currentDate = new Date();

  public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
  public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
  public list_QC : any= ["QC", "HR"];
  public isDisabled = false;
  public imageUrl = environment.imageUrl + "/download-file";
  public textPattern = "[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$"
  @ViewChild('dp1') dp1; 
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private enumStoredService: EnumStoredService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const configBackdrop = {
        backdrop: 'static',
        keyboard: false
    }
    $("#experience_info").modal(configBackdrop);
    $("#profile_info").modal(configBackdrop);
    $("#education_info").modal(configBackdrop);

    this.loadDataProfile({});
    this.loadEducationInfos([]);
    this.loadExps([]);

    this.id = this.route.snapshot.queryParams.id;

    this.contractService.findById(this.id).subscribe((data: any) => {
      this.profileInfo = data.candidate;
      this.educationInfo = data.educationInfos;
      this.expInfo = data.experiences;

      this.loadDataProfile(data.candidate);
      this.loadEducationInfos(data.educationInfos);
      this.loadExps(data.experiences);
    },err => {});

  }
  loadDataProfile(data: any){
    this.avatarBase64 = this.AVATAR_DEFAULT;
    $("#cvFileAdd").val('');
    let date:any = "";
    try {
      const dateSplit = data.birthday.split("/");
      date = new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[0]));
    } catch (error) {
      date = "";
    }
    if(data && data.avatarPath){
      this.avatarBase64 = this.imageUrl + data.avatarPath;
    }
    this.addContractForm = this.formBuilder.group({
      id: [data?.id ? data.id : "", []],
      firstName: [data?.firstName, [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
      lastName: [data?.lastName, [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
      candidateCode: [data?.candidateCode, []],
      identityCard: [data?.identityCard, [Validators.required, Validators.pattern("[0-9]+"), Validators.maxLength(20)]],
      email: [data?.email, [Validators.required, Validators.pattern('[a-zA-Z0-9]+@([a-zA-Z]+\\.)+[a-zA-Z]+'), Validators.maxLength(100)]],
      phone: [data?.phone, [Validators.required, Validators.maxLength(11), Validators.minLength(9), validaPhoneNumber]],
      birthday: [date ? date : "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
      address: [data?.address, [Validators.required, Validators.maxLength(1000)]],
      gender: [data?.gender ? data?.gender : "", [Validators.required]],
      roleType: [data?.roleType ? data.roleType:"", [Validators.required]],
      stack: [data?.stack ? data?.stack:"", []],
      workingTimeFrom: [data?.workingTimeFrom ? new Date(data?.workingTimeFrom) : "", [validDateCustom, validateMaxCurrentDate]],
      workingTimeWithStackFrom: [data?.workingTimeWithStackFrom ? new Date(data?.workingTimeWithStackFrom) : "", [validDateCustom, validateMaxCurrentDate]],
      avatarFile: [data?.avatarFile ? data?.avatarFile : "", [validRequiredType, validFileMaxSize]],
      maritalStatus: [data?.maritalStatus ? data?.maritalStatus : "", [Validators.required]],
      currentProcessingStatus: [data?.currentProcessingStatus, []],
      currentCompany: [data?.currentCompany, [Validators.required, Validators.maxLength(300)]],
      englishLevel: [data?.englishLevel ? data?.englishLevel : "", [Validators.required]],
      cvFile: ["", [validRequiredTypeDoc, validFileMaxSize]],
      avatarPath: [data?.avatarPath ? data?.avatarPath: null , []],
      cvPath: [data?.cvPath ? data?.cvPath: null , []],
    });

    if(this.list_QC.indexOf(this.addContractForm.value.roleType.trim()) >= 0){
      this.isDisabled = false;
    }else{
      this.isDisabled = true;
      this.addContractForm.get('stack').setValidators([Validators.required]);
      this.addContractForm.get('stack')?.updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
      this.addContractForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
    }
  }

  loadEducationInfos(data: any){
    this.eduInfoForm = this.formBuilder.group({
      eduInfos: this.formBuilder.array([])
    });
    const tempValue = {
      eduInfos: data
    }
    if(tempValue.eduInfos && tempValue.eduInfos.length > 0){
      for(let index = 0; index < tempValue.eduInfos.length; index++){
        this.onAddEduInfo(tempValue.eduInfos[index]);
      }
    }
    if(!tempValue || !tempValue.eduInfos || tempValue.eduInfos.length == 0){
      this.onAddEduInfo(null);
    }
  }

  loadExps(data: any){
    this.experienceForm = this.formBuilder.group({
      list: this.formBuilder.array([])
    });
    const tempVal = {
      list: this.expInfo
    }
    this.exps.clear();
    if(tempVal.list && tempVal.list.length > 0){
      for(let index = 0; index < tempVal.list.length; index++){
        this.onAddExp(tempVal.list[index]);
      }
    }
    if(!tempVal.list || tempVal.list.length < 1){
      this.onAddExp(null);
    }
  }

  /** START Block ProfileInfo */
  onClickProfile(){
    this.loadDataProfile(this.profileInfo);
    $("#profile_info").modal("toggle");
    // this.addContractForm.setValue({ ...this.addContractForm, });
    setTimeout(function(){
      $("#firstNameEditForm").trigger("focus"); 
    }, 500);
  }
  onSubmit() {
    this.addContractForm.markAllAsTouched();
    if(this.addContractForm.valid){
      const obj = Object.assign({}, this.addContractForm.value);
      delete obj["cvFile"];
      delete obj["avatarFile"];
      obj.birthday = this.datePipe.transform(obj.birthday, 'dd/MM/yyyy');
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
      this.contractService.update(formData, this.id).subscribe(result => {
        if(result && (result.status == 201 || result.status == 200)){
          this.contractService.findById(this.id).subscribe(result => {
            this.profileInfo = result.candidate;
            $("#profile_info").modal("hide");
            this.addContractForm.reset();
            this.toastr.success("Cập nhật thành công!", "Thông báo");
          }, error => {});
        }
      }, ({error}) => {
        this.toastr.error(error.detail || error.title, "Lỗi");
      })
    }
  }
  get educationInfomation(){
    return this.addContractForm.value;
  }
  /** END Block ProfileInfo */

  /** START Block Education Information */
  onClickEduInfo() {
    this.educationInfoRemoved = [];
    this.loadEducationInfos(this.educationInfo);
    $("#education_info").modal("toggle");
  }
  onSubmitEduInfo() {
    this.eduInfoForm.markAllAsTouched();
    const controls = this.eduInfoForm.controls;
    const invalid = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if(this.eduInfoForm.valid){
      const body = {
        deleteIds: this.educationInfoRemoved.map(el => el.id),
        educationInfos: this.educationInfomations.value.map(el => {
          el.candidate = { id: parseInt(this.id + "") };
          el.startingDate = el.startingDate ? new Date(el.startingDate).getTime() : null;
          el.completeTime = el.completeTime ? new Date(el.completeTime).getTime() : null;
          el.id = el.id === "" ? null : el.id;
          return el;
        })
      }
      
      this.educationService.updateList(body).subscribe(result => {
        this.contractService.findById(this.id).subscribe(result => {
          this.educationInfo = result.educationInfos;
          $("#education_info").modal("toggle");
          this.toastr.success("Cập nhật thành công!", "Thông báo");
        }, error => {});
      }, ({error}) => {
        this.toastr.error(error.title, "Lỗi")
      });
    }
  }
  onRemoveEduInfo(index: number) {
    if(this.educationInfomations.value[index].id){
      this.educationInfoRemoved.push(JSON.parse(JSON.stringify(this.educationInfomations.value[index])))
    }
    this.educationInfomations.removeAt(index);
  }
  onAddEduInfo(value:any = null) {
    const eduForm = this.formBuilder.group({
      id: [value?.id ? value.id : "", []],
      institution: [value?.institution ? value.institution : "", [Validators.required, Validators.maxLength(100)]],
      subject: [value?.subject ? value.subject : "", [Validators.required, Validators.maxLength(100)]],
      startingDate: [value?.startingDate ? new Date(value.startingDate) : "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
      completeTime: [value?.completeTime ? new Date(value.completeTime) : "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
      degree: [value?.degree ? value.degree : "", [Validators.required]],
      grade: [value?.grade ? value.grade : "", [Validators.required, Validators.maxLength(10)]],
    }
    ,{ validators: [CustomeDateValidators.fromToDate('startingDate', 'completeTime', 'startGtEnd')]}
    )
    this.educationInfomations.push(eduForm);
    if(this.educationInfomations?.value.length > 0){
      setTimeout(() => {
        $(`#eduInfoForm_institution_${this.educationInfomations.value.length - 1}`).focus();
      }, 500);
    }
  }
  get educationInfomations() {
    return this.eduInfoForm?.controls["eduInfos"] as FormArray;
  }
  /** END Block Education Information */

  /** START EXP */
  onClickEditExp() {
    this.expInfoRemoved = [];
    this.loadExps(this.expInfo);
    $("#experience_info").modal("toggle");
  }
  onSubmitExps() {
    this.experienceForm.markAllAsTouched();
    const controls = this.experienceForm.controls;
    const invalid = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if(this.experienceForm.valid){
      const body = {
        deleteIds: this.expInfoRemoved.map(el => el.id),
        experiences: this.exps.value.map(el => {
          el.candidate = { id: parseInt(this.id + "") };
          el.id = (el.id === "" ? null : el.id);
          el.periodFrom = el.periodFrom ? new Date(el.periodFrom).getTime() : null;
          el.periodTo = el.periodTo ? new Date(el.periodTo).getTime() : null;
          return el;
        })
      }
      
      this.experienceService.updateList(body).subscribe(result => {
        this.contractService.findById(this.id).subscribe(result => {
          this.expInfo = result.experiences;
          $("#experience_info").modal("toggle");
          this.toastr.success("Cập nhật thành công!", "Thông báo");
        }, error => {});
      }, ({error}) => {
        this.toastr.error(error.title, "Lỗi")
      });
    }
  }
  onRemoveExp(index: number){
    if(this.exps.value[index].id){
      this.expInfoRemoved.push(JSON.parse(JSON.stringify(this.exps.value[index])));
    }
    this.exps.removeAt(index);
  }
  onAddExp(value: any = null){
    const childForm = this.formBuilder.group({
      id: [value?.id ? value.id : "", []],
      companyName: [value?.companyName ? value.companyName: "", [Validators.required]],
      location: [value?.location ? value.location: "", [Validators.required]],
      jobPosition: [value?.jobPosition ? value.jobPosition: "", [Validators.required]],
      periodFrom: [value?.periodFrom ? new Date(value.periodFrom): "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
      periodTo: [value?.periodTo ? new Date(value.periodTo): "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
    }
    ,{ validators: [CustomeDateValidators.fromToDate('periodFrom', 'periodTo', 'startGtEnd')]}
    );
    this.exps.push(childForm);
    if(this.exps.length > 0) {
      setTimeout(() => {
        $(`#experienceForm_jobPosition_${this.exps.value.length - 1}`).focus();
      }, 500);
    }
  }
  get exps(){
    return this.experienceForm.controls["list"] as FormArray;
  }
  /** END EXP */


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

  onKeyInputNumber(event: any){
    if("0123456789".indexOf(event.key) < 0){
      event.preventDefault();
    }
  }

  onChangeRole(){
    if(this.list_QC.indexOf(this.addContractForm.value.roleType.trim()) >= 0){
      this.addContractForm.get('stack').clearValidators();
      this.addContractForm.get('stack').updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom').clearValidators();
      this.addContractForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom')?.reset("");
      this.isDisabled = false;
    }else{
      this.addContractForm.get('stack').setValidators([Validators.required]);
      this.addContractForm.get('stack').updateValueAndValidity();
      this.addContractForm.get('stack').reset("");
      this.addContractForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
      this.addContractForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
      this.addContractForm.get('workingTimeWithStackFrom').reset("");
      this.isDisabled = true;
    }
  }

  onBlur(fieldName: string) {
    if(this.addContractForm.value && typeof this.addContractForm.value[fieldName] == "string"){
      this.addContractForm.setValue({ ...this.addContractForm.value, [fieldName]: this.addContractForm.value[fieldName].trim() });
    }
  }

  onBlurEduInfoForm(fieldName: string, index: number) {
    const eduInfoForms: any[] = this.eduInfoForm?.controls["eduInfos"].value;
    eduInfoForms[index][fieldName] = eduInfoForms[index][fieldName].trim();
    this.eduInfoForm.setValue({
      eduInfos: eduInfoForms
    })
  }

  onBlurExpInfoForm(fieldName: string, index: number) {
    const expInfos: any[] = this.experienceForm.controls["list"].value; 
    expInfos[index][fieldName] = expInfos[index][fieldName].trim();
    this.experienceForm.setValue({
      list: expInfos
    })
  }

}
