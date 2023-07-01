import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { getAdminUnit, getAdminUnitList } from './../../../../../core/services/constant.service';
import { Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { CountryService } from "src/app/core/services/country.service";
declare const $: any;

@Component({
    selector: "app-address-information-modal",
    templateUrl: "./address-information-modal.component.html",
    styleUrls: ["./address-information-modal.component.css"],
})
export class AddressInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public addressInformationForm: FormGroup;
    public addressOtherInformationForm: FormGroup;
    @Input()
    public idModal: string = "current-address-information-modal";
    @Input() value: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @ViewChild("radioVietNam") radioVietNam: ElementRef;
    @ViewChild("radioOther") radioOther: ElementRef;
    public isDisabled: Boolean = false;
    public textPattern = Constant.NAME_RULE;
    public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
    public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
    public roleCandidates: any = [];
    public stackCandidates: any = [];
    public stackLevelCandidates = [];
    public districtList: any = [];
    public districtList2: any = [];
    public districtList3: any = [];
    public provinceList: any = [];
    public provinceList2: any = [];
    public provinceList3: any = [];
    public wardList: any = [];
    public wardList2: any = [];
    public wardList3: any = [];
    public COUNTRY_DEFAULT: string = 'VietNam';
    public nationality: string="";
    public imageUrl = environment.imageUrl + "/download-file";
    public isLoadProvince: boolean = false;
    public isLoadDistrict: boolean = false;
    public isLoadWard: boolean = false;
    public nationalityList: any = [];
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private countryService: CountryService
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            this.addressInformationForm.reset();
            this.isLoadProvince = true;
            this.isLoadDistrict = true;
            this.isLoadWard = true;
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.loadData();
        }
    }

    async setDefaultValue(value: any) {
        if(value){
            if(value?.nationality != this.COUNTRY_DEFAULT){
                this.nationality == value.nationality;
                this.radioOther.nativeElement.click();
            }else{
                this.nationality == this.COUNTRY_DEFAULT;
                this.radioVietNam.nativeElement.click();
            }
            this.addressInformationForm.setValue({
                id: value?.id ? value?.id : null,
                originProvince: value?.originProvince ? await this.getUnitSelected(value.originProvince) : "",
                originDistrict: value?.originDistrict ? await this.getUnitSelected(value.originProvince, value.originDistrict) : "",
                
                permanentResidenceProvince: value?.permanentResidenceProvince ? await this.getUnitSelected(value.permanentResidenceProvince) : "",
                permanentResidenceDistrict: value?.permanentResidenceDistrict ? await this.getUnitSelected(value.permanentResidenceProvince, value.permanentResidenceDistrict) : "",
                permanentResidenceAdrress: value?.permanentResidenceAdrress ? value?.permanentResidenceAdrress : "",
    
                currentProvince: value?.currentProvince ?  await this.getUnitSelected(value.currentProvince) : "",
                currentDistrict: value?.currentDistrict ? await this.getUnitSelected(value.currentProvince, value.currentDistrict) : "",
                currentWard: value?.currentWard ? await this.getUnitSelected(value.currentProvince, value.currentDistrict, value.currentWard): "",
                currentAddress: value?.currentAddress ? value?.currentAddress : "",
            });
            let finder = "";
            if(value?.nationality){
                finder = this.nationalityList.find(el => el.name == value.nationality)
            }
            this.addressOtherInformationForm.setValue({
                id: value?.id ? value?.id : null,
                currentAddress: value?.currentAddress ? value?.currentAddress : "",
                country: finder ? finder : "",
            });
        }
    }

    async getUnitSelected(provinceId:number = 0, districId: number = 0, wardId: number = 0){
        let results = await getAdminUnit(provinceId, districId, wardId);
        return results;
    }

    countries: any[];
    selectedCountry: string='';
    onChangeV1(val: any){
    }
    ngOnInit() {
        this.countries = [
            {name: 'Australia', code: 'AU'},
            {name: 'Brazil', code: 'BR'},
            {name: 'China', code: 'CN'},
            {name: 'Egypt', code: 'EG'},
            {name: 'France', code: 'FR'},
            {name: 'Germany', code: 'DE'},
            {name: 'India', code: 'IN'},
            {name: 'Japan', code: 'JP'},
            {name: 'Spain', code: 'ES'},
            {name: 'United States', code: 'US'}
        ];
        this.countryService.getAllCountry().subscribe(result => {
            this.nationalityList = result.map(el => {
                const newEl: any = {};
                newEl.name = el;
                return newEl;
            });
        }, ({ error }) => {
        });
        this.nationality = this.COUNTRY_DEFAULT;
        this.addressOtherInformationForm = this.formBuilder.group({
            id: [null, []],
            currentAddress: ["", [Validators.required, Validators.maxLength(200)]],
            country: ["", [Validators.required]],
        });
        this.addressInformationForm = this.formBuilder.group({
            id: [null, []],
            originDistrict: ["", [Validators.required]],
            originProvince: ["", [Validators.required]],
            
            permanentResidenceDistrict: ["", [Validators.required]],
            permanentResidenceProvince: ["", [Validators.required]],
            permanentResidenceAdrress: ["", [Validators.required, Validators.maxLength(200)]],

            currentDistrict: ["", [Validators.required]],
            currentProvince: ["", [Validators.required]],
            currentWard: ["", [Validators.required]],
            currentAddress: ["", [Validators.required, Validators.maxLength(200)]],
        });

        getAdminUnitList().then(result => {
            this.provinceList = result;
            this.provinceList2 = result;
            this.provinceList3 = result;
        }).catch(error => {})

        this.addressInformationForm.controls['originProvince'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['originProvince'].value) {
                this.loadDistrict(this.addressInformationForm.controls['originProvince'].value?.name);
                this.wardList = [];
            } else {
                this.districtList = [];
                this.wardList = [];
            }
        });
        this.addressInformationForm.controls['originDistrict'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['originDistrict'].value) {
                this.loadWard(this.addressInformationForm.controls['originDistrict'].value?.name);
            } else {
                this.wardList = [];
            }
        });

        this.addressInformationForm.controls['permanentResidenceProvince'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['permanentResidenceProvince'].value?.name) {
                this.loadDistrict(this.addressInformationForm.controls['permanentResidenceProvince'].value?.name, 2);
                this.wardList2 = [];
            } else {
                this.districtList2 = [];
                this.wardList2 = [];
            }
        });
        this.addressInformationForm.controls['permanentResidenceDistrict'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['permanentResidenceDistrict'].value?.name) {
                this.loadWard(this.addressInformationForm.controls['permanentResidenceProvince'].value.code, this.addressInformationForm.controls['permanentResidenceDistrict'].value?.name, 2);
            } else {
                this.wardList2 = [];
            }
        });

        this.addressInformationForm.controls['currentProvince'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['currentProvince'].value?.name) {
                this.loadDistrict(this.addressInformationForm.controls['currentProvince'].value?.name, 3);
                this.wardList3 = [];
            } else {
                this.districtList3 = [];
                this.wardList3 = [];
            }
            // this.addressInformationForm.controls['currentDistrict'].setValue('');
            // this.addressInformationForm.controls['currentWard'].setValue('');
        });
        this.addressInformationForm.controls['currentDistrict'].valueChanges.subscribe(() => {
            if (this.addressInformationForm.controls['currentDistrict'].value?.name) {
                this.loadWard(this.addressInformationForm.controls['currentProvince'].value?.name, this.addressInformationForm.controls['currentDistrict'].value?.name, 3);
            } else {
                this.wardList3 = [];
            }
            // this.addressInformationForm.controls['currentWard'].setValue('');
        });

    }

    
    loadDistrict(provinceId: any = 0, type: number = 1) {
        if (provinceId) {   
            getAdminUnitList(provinceId).then(results => {
                if(type == 1){
                    this.districtList = results;
                }else if(type == 2){
                    this.districtList2= results;
                }else{
                    this.districtList3 = results;
                }
            }).catch(error => {})
        }
    }

    loadWard(provinceId: any = 0, districtId: any = 0, type: number = 1) {
        if (districtId) {
            getAdminUnitList(provinceId, districtId).then(results => {
                if(type == 1){
                    this.wardList = results;
                }else if(type == 2){
                    this.wardList2= results;
                }else{
                    this.wardList3 = results;
                }
            });
        }
    }

    get controls() {
        return this.addressInformationForm.controls
    }

    loadData() {
        this.setDefaultValue(this.value);
    }

    onSave() {
        if(this.nationality == this.COUNTRY_DEFAULT){
            this.addressInformationForm.markAllAsTouched();
            if (this.addressInformationForm.valid) {
                this.onSubmit.emit({
                    id: this.value.id,
                    originDistrict: this.addressInformationForm.value.originDistrict.name,
                    originProvince: this.addressInformationForm.value.originProvince.name,
                    
                    permanentResidenceDistrict: this.addressInformationForm.value.permanentResidenceDistrict.name,
                    permanentResidenceProvince: this.addressInformationForm.value.permanentResidenceProvince.name,
                    permanentResidenceAdrress: this.addressInformationForm.value.permanentResidenceAdrress,

                    currentDistrict: this.addressInformationForm.value.currentDistrict.name,
                    currentProvince: this.addressInformationForm.value.currentProvince.name,
                    currentWard: this.addressInformationForm.value.currentWard.name,   
                    currentAddress: this.addressInformationForm.value.currentAddress,   
                    nationality: this.nationality
                });
            }
        }else{
            this.addressOtherInformationForm.markAllAsTouched();
            if (this.addressOtherInformationForm.valid) {
                this.onSubmit.emit({...this.addressOtherInformationForm.value, nationality: this.addressOtherInformationForm.value?.country?.name, id: this.value.id ? this.value.id : null });
            }
        }
        
    }

    onBlur(fieldName: string) {
        if (this.addressInformationForm.value && typeof this.addressInformationForm.value[fieldName] == "string") {
            this.addressInformationForm.setValue({ ...this.addressInformationForm.value, [fieldName]: this.addressInformationForm.value[fieldName].trim() });
        }
    }
    onBlurOthter(fieldName: string) {
        if (this.addressOtherInformationForm.value && typeof this.addressOtherInformationForm.value[fieldName] == "string") {
            this.addressOtherInformationForm.setValue({ ...this.addressOtherInformationForm.value, [fieldName]: this.addressOtherInformationForm.value[fieldName].trim() });
        }
    }

    onCancel() {
        $("#" + this.idModal).modal("hide");
    }

    public districtListFilter: any[];
    filterProvince(event) {
        this.districtListFilter = [];
        for (let i = 0; i < this.districtList.length; i++) {
            let province = this.districtList[i];
            if (province?.province_name.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
                this.districtListFilter.push(province);
            }
        }
    }

    onChanggeOriginProvince() {
        this.addressInformationForm.controls['originDistrict'].setValue('');
    }

    onChanggeCurrentProvince() {
        this.addressInformationForm.controls['currentDistrict'].setValue('');
        this.addressInformationForm.controls['currentWard'].setValue('');
    }
    onChangeCurrentDistrict() {
        this.addressInformationForm.controls['currentWard'].setValue('');
    }

    onChangePermanentResidenceProvince() {
        this.addressInformationForm.controls['permanentResidenceDistrict'].setValue('');
    }

}
