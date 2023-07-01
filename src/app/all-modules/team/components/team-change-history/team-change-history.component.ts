import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as moment from "moment";
import {GetTeamHistoryRequest, TeamHistory} from "../../../../core/models/team.model";
import {PageRequest} from "../../../../core/models/request.model";
import {Page} from "../../../../core/models/response.model";
import {finalize, take} from "rxjs/operators";
import {RadioButton} from "primeng/radiobutton";
import {BsModalRef} from "ngx-bootstrap/modal";
import {TeamService} from "../../../../core/services/team.service";

declare const $;
@Component({
    selector: 'app-team-change-history',
    templateUrl: './team-change-history.component.html',
    styleUrls: ['./team-change-history.component.scss']
})
export class TeamChangeHistoryComponent implements OnInit, OnChanges{

    @Input() teamId: number = 1;
    @ViewChild('radio', {static: false}) radioList: RadioButton[];
    @ViewChild('detailTable', {static: false}) detailTable: ElementRef<any>;

    loading = false;
    teamHistoryPage: Page<TeamHistory>;
    selectedHistory: TeamHistory = null;
    maxDate: Date;
    dateRange: any[] = [];
    pageMeta = {
        pageNumber: 0,
        pageSize: 10,
        totals: 0
    }

    constructor(private teamService: TeamService,
                private modalRef: BsModalRef) {
    }

    ngOnInit(): void {
        this.maxDate = moment().toDate();
        this.initDate();
        this.search();
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    initDate(): void {
        this.dateRange = [
            moment().startOf('month').toDate(),
            moment().toDate()
        ]
    }

    changePage(pageNumber: number, pageSize: number): void {
        this.pageMeta = {
            ...this.pageMeta,
            pageSize,
            pageNumber
        };
        this.search();
    }

    checkDate(): void {
        if (moment(this.dateRange[1]).startOf('date').isAfter(moment().startOf('date'))) {
            this.dateRange = [this.dateRange[0], this.maxDate];
        }
        if (moment(this.dateRange[0]).startOf('date').isAfter(moment(this.dateRange[1]).startOf('date'))) {
            this.dateRange= [this.dateRange[1], this.dateRange[1]];
        }
    }

    search(): void {
        if (!this.dateRange || !this.dateRange[1]) {
            this.dateRange = [this.dateRange[0], this.maxDate]
        }
        const req: PageRequest<GetTeamHistoryRequest> = {
            request: {
                from_time: moment(this.dateRange[0]).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                to_time: moment(this.dateRange[1]).startOf('date').format('YYYY-MM-DDTHH:mm:ssz[Z]'),
                team_id: this.teamId
            },
            page: {
                page: this.pageMeta.pageNumber,
                page_size: this.pageMeta.pageSize
            }
        }
        this.loading = true;
        this.teamService.getHistory(req).pipe(
            take(1),
            finalize(() => this.loading = false)
        ).subscribe(response => {
            this.teamHistoryPage = response.data;
            this.pageMeta = {
                ...this.pageMeta,
                totals: response.data.count
            };
        })
    }

    showDetail(change: any): void {
        this.selectedHistory = change;
        if (this.detailTable) {
            (this.detailTable.nativeElement as HTMLElement).scrollIntoView({behavior: 'smooth'});
        }
    }

    onClose(): void {
        this.modalRef.hide();
    }

}
