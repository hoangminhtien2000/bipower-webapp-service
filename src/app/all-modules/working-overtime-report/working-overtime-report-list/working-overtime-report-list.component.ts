import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from "@angular/common";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {AllModulesService} from "../../all-modules.service";
import {WorkingOvertimeReportService} from 'src/app/core/services/working-overtime-report.service';
import {KeyValueModel} from 'src/app/core/models/key-value.model';
import * as moment from 'moment';

declare const $: any;

@Component({
    selector: 'app-working-overtime-report-list',
    templateUrl: './working-overtime-report-list.component.html',
    styleUrls: ['./working-overtime-report-list.component.css']
})
export class WorkingOvertimeReportListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DataTableDirective, {static: true})
    public dtElement: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dtTrigger: Subject<any> = new Subject();
    public pipe = new DatePipe("en-US");
    public url: any = "contract";
    public tempId: any;
    public editId: any;
    public searchForm: FormGroup;
    public listData = [];
    public editedvalue;
    public btnSearchIsClicked = false;
    public txtEmployeeName = "";
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
    public currentYear = this.currentDate.getFullYear();
    public rows = [];
    public srch = [];
    public checkAll: Boolean = false;
    public preValueFormSearch: any = null;
    public isLoad = false;
    public selectedDate = this.currentDate;

    constructor(
        private formBuilder: FormBuilder,
        private srvModuleService: AllModulesService,
        private service: WorkingOvertimeReportService,
        private toastr: ToastrService
    ) {
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
            year: [new Date(), [Validators.required]],
            role: ["", []],
            companyEmail: ["", []]
        });

        if ($('.floating').length > 0) {
            $('.floating').on('focus blur', function (e) {
                $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
            }).trigger('blur');
        }
        this.searchForm.controls['year'].valueChanges.subscribe(result => {
            this.onClickBtnSearch();
        });
        this.onClickBtnSearch();
    }

    onChangeYear(data) {
        this.selectedDate = data;
        this.onClickBtnSearch();
    }

    loadData(changePageSize: any = null, changePageIndex: any = null) {
        if (this.isLoad) {
            return;
        }
        let dataInput: any = {};
        this.searchForm.markAllAsTouched();
        if (this.selectedDate) {
            this.isLoad = true;
            this.checkAll = false;
            if (this.selectedDate) {
                dataInput.year = moment(this.selectedDate).format("yyyy");
            }
            if ((changePageSize == null && changePageIndex == null)) {
                if (this.pageSize >= 0) {
                    dataInput.size = this.pageSize;
                }
                if (this.pageIndex >= 0) {
                    dataInput.page = this.pageIndex > 1 ? this.pageIndex - 1 : 0;
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
            this.service.getStaticReport(dataInput).subscribe(({data}: any) => {
                    this.listData = data.content;
                    this.rows = this.listData;
                    this.totalPages = data.totalPages;
                    this.pageArr = Array(this.totalPages).fill(0).map((_, i) => i + 1);
                    this.totalElements = data.totalElements;
                    this.numberOfElements = data.numberOfElements;
                    this.last = data.last;
                    this.first = data.first;
                    // this.srch = [...this.rows];
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

    onClickBtnSearch() {
        this.searchForm.markAllAsTouched();
        const controls = this.searchForm.controls;
        const invalid = [];
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        if (this.searchForm.valid) {
            this.pageIndex = 0;
            this.loadData();
        }
    }

    // input searchName
    searchName(newVal) {
        this.txtEmployeeName = newVal;
    }

    pageChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadData(true, true);
    }

    rerender() {

    }

    deleteContract() {
        this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
            });

            this.loadData(true);
            $("#delete_job").modal("hide");
            this.toastr.success("contract deleted sucessfully..!", "Success");
        });
    }


    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    onClickPagination(index: number): void {
        if (index >= 0 && this.pageIndex != index) {
            this.pageIndex = index;
            this.loadData(true, true);
        }
    }

    onClickPaginationPrev(): void {
        if (!this.first) {
            this.pageIndex = 0;
            this.loadData(true, true);
        }
    }

    onClickPaginationNext(): void {
        if (!this.last) {
            this.pageIndex = Math.ceil(this.totalElements / this.pageSize);
            this.loadData(true, true);
        }
    }

    onChangePageSize(page): void {
        this.pageSize = parseInt(page);
        this.loadData(true);
    }

    get isHidden() {
        return this.totalElements > 0;
    }

    onBlurSearch(fieldName: string) {
        if (this.searchForm.value && typeof this.searchForm.value[fieldName] == "string") {
            this.searchForm.setValue({...this.searchForm.value, [fieldName]: this.searchForm.value[fieldName].trim()});
        }
    }

    onKeypress(event) {
        if (event.keyCode == 13) {
            this.loadData();
        }
    }

    updateStatusCheckedAll(value: any = false) {
        if (this.listData && this.listData.length >= 0) {
            this.listData.forEach(element => {
                element.checked = value;
            });
        }
    }

    onClickCheckBox(event: any, index: number) {
        if (index == -1) {
            if (event.target.checked == true) {
                this.checkAll = true;
                this.updateStatusCheckedAll(true);
            } else {
                this.checkAll = false;
                this.updateStatusCheckedAll(false);
            }
        } else {
            this.listData[index].checked = event.target.checked;
            const finder = this.listData.find(el => el.checked == false);
            if (finder) {
                this.checkAll = false;
            } else {
                this.checkAll = true;
            }

        }
    }

    getTime(item: any, index: number) {
        if (item?.overtimeDatas) {
            item.overtimeDatas as KeyValueModel;
            const founder = item.overtimeDatas?.find((el: KeyValueModel) => el.key == index);
            if (founder) {
                return founder.value;
            }
        }
        return "-";
    }

    public listFieldName = ["fullName", "contractCode", "startDate", "contractTerm", "endDate", "contractTerminationDate", "status"];
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


        this.loadData(true, true);
    }

    onKeypressYear(event) {
        if (event.keyCode == 13) {
            this.onClickBtnSearch();
        }
    }

}
