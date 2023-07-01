import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
declare const $: any;

@Component({
    selector: "app-performance-history-modal",
    templateUrl: "./performance-history-modal.component.html",
    styleUrls: ["./performance-history-modal.component.css"],
})
export class PerformanceHistoryModalComponent implements OnInit, OnChanges, AfterViewInit {
    @Input()
    public idModal: string = "performance-history-modal";
    @Input() value: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @Input() history: any = [];
    public rows: any = [];
    public totalPages = 0;
    public pageArr = [];
    public totalElements = 0;
    public numberOfElements = 0;
    public last = false;
    public first = false;
    public pageSize = 5;
    public pageIndex = 0;
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private enumService: EnumStoredService
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            
        }
    }

    ngOnInit() {
    }

    handleData() {
        this.totalElements = Math.ceil(this.history/this.pageSize);
        this.rows = this.history;
    }

    close() {
        $("#" + this.idModal).modal("hide");
    }

    onChangePageSize(page): void {
        this.pageSize = parseInt(page);
        this.handleData();
    }

    pageChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.handleData();
    }

    getList() {
        return this.history?.filter((el, index) => (index < (this.pageIndex > 1 ? this.pageIndex - 1 : 0) * this.pageSize + this.pageSize) && (index >= (this.pageIndex > 1 ? this.pageIndex - 1 : 0) * this.pageSize));
    }
}
