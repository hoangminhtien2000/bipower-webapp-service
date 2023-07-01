import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FieldType} from "@ngx-formly/core";
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
    selector: 'vt88-core-type-ahead',
    templateUrl: './type-ahead.component.html',
    styleUrls: ['./type-ahead.component.scss'],
    providers: [NgbDropdownConfig]
})
export class TypeAheadComponent extends FieldType implements OnInit, AfterViewInit {
    @ViewChild('textSearch') textSearch: ElementRef;
    @ViewChild('myDrop') tableResult: ElementRef;
    isSearching = false;
    disableSearch: boolean;

    constructor(config: NgbDropdownConfig, private httpClient: HttpClient) {
        super();
        config.autoClose = 'outside';
    }

    columns: any = []
    datas: any = [];
    textSearchModel: any;

    ngOnInit() {
        // @ts-ignore
        this.textSearchModel = this.model[this.field.key] ? this.model[this.field.key].searchText : null;
        if (this.textSearchModel) {
            this.disableSearch = true;
        }
        this.field.formControl.valueChanges.subscribe(data => {
            if (!data) {
                this.textSearchModel = null;
                this.disableSearch = false;
            }
        })
    }

    doSearch(text: any) {
        this.datas = [];
        const params = this.buildParams();
        this.httpClient.get<any>(this.to.urlApi, {params}).subscribe(res => {
            this.isSearching = false;
            if (this.to.responseData && res[this.to.responseData]) {
                this.datas = res[this.to.responseData];
            } else {
                this.datas = res || [];
            }
            if (this.datas[0]) {
                this.datas[0].focus = true;
            }
        })
    }

    ngAfterViewInit(): void {
        // @ts-ignore
        fromEvent(this.textSearch.nativeElement, 'keyup').pipe(
            map((event: any) => {
                return event.target.value;
            })
            // Chỉ tìm khi kí tự ít nhất lớn hơn:
            // , filter(res => res.length > 2)
            // Thời gian chờ
            , debounceTime(this.to.deboundTime)
            // If previous query is diffent from current
            , distinctUntilChanged()
            // subscription for response
        ).subscribe((text: string) => {
            // @ts-ignore
            this.tableResult.open();
            this.isSearching = true;
            this.doSearch(text);
        });
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                // @ts-ignore
                this.tableResult.open();
                this.setFocusItem(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                // @ts-ignore
                this.tableResult.open();
                this.setFocusItem(-1);
                break;
            case 'Tab':
                break;
            case 'Enter':
                const focused = this.datas.find(item => item.focus === true);
                // @ts-ignore
                this.tableResult.open();
                if (focused) {
                    event.preventDefault();
                    this.selectItem();
                } else {
                    this.selectNewItem();
                    // this.doSearch(this.textSearchModel);
                }
                break;
        }
    }

    setFocusItem(number) {
        const current = this.datas.find(item => item.focus === true);
        if (!current) {
            this.datas[0].focus = true;
            return;
        }
        const currentIndex = (this.datas.indexOf(current));
        if ((number < 0 && currentIndex > 0) || (number > 0 && currentIndex < this.datas.length - 1)) {
            this.datas.forEach(item => {
                item.focus = false;
            })
            this.datas[currentIndex + number].focus = true;
        }
    }

    private selectItem() {
        // @ts-ignore
        this.tableResult.close();
        this.disableSearch = true;
        const data = this.datas.find(item => item.focus === true);
        if (data) {
            if (this.to.selectedField) {
                this.field.formControl.setValue(
                    {
                        searchText: this.getDisplay(data, this.to.fieldDisplay),
                        data: data[this.to.selectedField]
                    }
                );
            } else {
                this.field.formControl.setValue(
                    {
                        searchText: this.getDisplay(data, this.to.fieldDisplay),
                        data: data
                    }
                );
            }
            this.textSearchModel = this.getDisplay(data, this.to.fieldDisplay);
        }
    }

    clickRow(data: any) {
        this.disableSearch = true;
        if (!data) {
            // @ts-ignore
            this.tableResult.close();
            this.field.formControl.setValue({
                searchText: this.textSearchModel,
                data: data
            });
            if (this.to.dataKeyField) {
                this.model[this.to.dataKeyField] = data;
            }
            return;
        }
        if (this.to.selectedField) {
            // @ts-ignore
            this.tableResult.close();
            this.field.formControl.setValue({
                searchText: this.getDisplay(data, this.to.fieldDisplay),
                data: data[this.to.selectedField]
            });
        } else if (this.to.dataKeyField) {
            // @ts-ignore
            this.tableResult.close();
            this.field.formControl.setValue({
                searchText: this.getDisplay(data, this.to.fieldDisplay),
                data: data
            });
            this.model[this.to.dataKeyField] = data;
        } else {
            // @ts-ignore
            this.tableResult.close();
            this.field.formControl.setValue({
                searchText: this.getDisplay(data, this.to.fieldDisplay),
                data: data
            });
        }
        this.textSearchModel = this.getDisplay(data, this.to.fieldDisplay);
    }

    reset() {
        this.textSearchModel = '';
        this.disableSearch = false;
        this.field.formControl.setValue({searchText: '', data: null});
        if (this.to.dataKeyField) {
            this.model[this.to.dataKeyField] = null;
        }
        this.to.removeSubject.next(true);
    }

    private buildParams() {
        let params = new HttpParams();
        this.to.queryParams.forEach(param => {
            if (param.type) {
                params = params.set(param.name, this.textSearchModel);
            } else if (param.control && param.field) {
                const value = this.field.parent.formControl.get(param.control).value[param.field];
                params = params.set(param.name, value);
            }
        })
        return params;
    }

    getDisplay(data: any, col: any) {
        if (!col.isArray) {
            return data[col.field];
        }
        const arr = data[col.field];
        let result = "";
        if (col.getIndex === 0 || col.getIndex) {
            result = arr[col.getIndex][col.keyField];
        } else if (col.getByKey) {
            const target = arr.find(elm => {
                return elm[col.getByKey.key] === col.getByKey.value;
            });
            if (target) {
                result = target[col.keyField];
            }
        }
        return result;
    }

    selectNewItem() {
        this.clickRow(null);
    }
}
