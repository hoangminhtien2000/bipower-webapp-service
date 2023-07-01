import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {SearchTeamRequest} from "../../../../core/models/team.model";
import {catchError, filter, finalize, take} from "rxjs/operators";
import {PageRequest} from "../../../../core/models/request.model";
import {TeamValidator} from "../../team.validator";
import {throwError} from "rxjs";
import {TeamFilterComponent} from "../../components/team-filter/team-filter.component";
import {BsModalService} from "ngx-bootstrap/modal";
import {CreateTeamDialogComponent} from "../../components/create-team-dialog/create-team-dialog.component";
import {TeamService} from "../../../../core/services/team.service";
import {CONFIG} from "../../../../core/config/application.config";

declare const $;

@Component({
    selector: 'app-list-team',
    templateUrl: './list-team.component.html',
    styleUrls: ['./list-team.component.css'],
    providers: [
        DialogService
    ]
})
export class ListTeamComponent implements OnInit {

    @ViewChild(TeamFilterComponent, {static: false}) filterComponent: TeamFilterComponent;

    readonly createDialogModal = 'modal_create_dialog';
    teamList: any[] = [];
    searchTeamRequest: SearchTeamRequest = {};
    loading = false;
    pageMeta = {
        pageSize: 10,
        pageNumber: 0,
        totalItems: 0
    };
    summary = {
        average_effort: 0,
        total_member: 0,
        total_productivity: 0,
        total_salary: 0
    };

    constructor(private teamService: TeamService,
                private modalService: BsModalService,
                private teamValidator: TeamValidator) {
    }

    ngOnInit(): void {
        this.getListTeam();
    }

    onCreate(): void {
        const requiredPermission = CONFIG.PERMISSION.ACTION.CREATE_TEAM;
        const accept = this.teamValidator.validatePermission(requiredPermission, false);
        if (!accept) {
            return;
        }
        // $(`#${this.createDialogModal}`).modal("show");
        const ref = this.modalService.show(CreateTeamDialogComponent, {
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        ref.content.saveSubject$.pipe(
            filter(data => !!data)
        ).subscribe(res => {
            this.changePageData(0, this.pageMeta.pageSize);
        })
    }

    /**
     * handle form search submit
     * @param dataSearch raw form data
     */
    onSearch(dataSearch: any): void {
        this.searchTeamRequest = {
            name: dataSearch.name,
            team_type_id: dataSearch.type?.item_id,
            domains: dataSearch.domain?.map(el => ({domain_id: el.item_id})),
            technologies: dataSearch.tech?.map(el => ({technology_id: el.item_id}))
        }
        this.changePageData(0, this.pageMeta.pageSize);
    }

    /**
     * handle pagination change
     * @param pageNumber
     * @param pageSize
     */
    changePageData(pageNumber: number, pageSize: number): void {
        this.pageMeta = {
            ...this.pageMeta,
            pageNumber: pageNumber,
            pageSize: pageSize
        };
        this.getListTeam();
    }

    /**
     * get list team
     * @param data
     */
    getListTeam(): void {
        const request: PageRequest<SearchTeamRequest> = {
            request: this.searchTeamRequest,
            page: {
                page: this.pageMeta.pageNumber,
                page_size: this.pageMeta.pageSize
            }
        }
        this.loading = true;
        this.teamService.searchTeam(request).pipe(
            take(1),
            finalize(() => this.loading = false),
            catchError(error => {
                this.teamValidator.handleResponseError(error)
                return throwError(error);
            })
        ).subscribe(response => {
            this.teamList = response.data?.items;
            this.summary = {
                average_effort: (response.data as any)?.average_effort || 0,
                total_member: (response.data as any)?.total_member || 0,
                total_productivity: (response.data as any)?.total_productivity || 0,
                total_salary: (response.data as any)?.total_salary || 0
            }
            this.pageMeta = {
                ...this.pageMeta,
                totalItems: response.data?.count
            }
        });
    }

    reaload(event: any): void {
        this.searchTeamRequest = {};
        this.filterComponent.formSearch.reset();
        this.filterComponent.onSubmit();
        // this.changePageData(0, this.pageMeta.pageSize);
    }

}
