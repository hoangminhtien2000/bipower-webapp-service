import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {filter, take} from "rxjs/operators";
import {Catalog} from "../../../../core/models/catalog.model";
import {TeamValidator} from "../../team.validator";
import {CatalogItemService} from "../../../../core/services/catalog.item.service";
import {TeamService} from "../../../../core/services/team.service";
import {CONFIG} from "../../../../core/config/application.config";
import {BsModalService} from "ngx-bootstrap/modal";
import {ConfirmSaveDialogComponent} from "../confirm-save-dialog/confirm-save-dialog.component";
import {ConfirmDeleteTeamComponent} from "../confirm-delete-team/confirm-delete-team.component";

@Component({
    selector: 'app-team-filter',
    templateUrl: './team-filter.component.html',
    styleUrls: ['./team-filter.component.css']
})
export class TeamFilterComponent implements OnInit {

    teamTypes: Catalog[] = [];
    techList: Catalog[] = [];
    domainList: Catalog[] = [];
    canCreateTeam = false;
    @Output() create = new EventEmitter<void>();
    @Output() search = new EventEmitter<any>();

    formSearch: FormGroup;

    constructor(private teamService: TeamService,
                private catalogService: CatalogItemService,
                public teamValidator: TeamValidator) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getTeamType();
        this.getTechList();
        this.getDomainList();
        this.canCreateTeam = this.teamValidator.validatePermission(CONFIG.PERMISSION.ACTION.CREATE_TEAM, false);
    }

    initForm(): void {
        this.formSearch = new FormGroup({
            name: new FormControl('', Validators.maxLength(50)),
            type: new FormControl(''),
            tech: new FormControl([]),
            domain: new FormControl([])
        });
    }

    groupTech(): void {
        const currentTech = this.formSearch.get('tech').value as Catalog[];
        this.techList = [
            ...currentTech,
            ...this.techList.filter(option => !currentTech.some(t => t.item_id == option.item_id))];
    }

    groupDomain(): void {
        const currentDomain = this.formSearch.get('domain').value as Catalog[];
        this.domainList = [...currentDomain, ...this.domainList.filter(option => !currentDomain.some(d => d.item_id == option.item_id))];
    }

    /**
     * get list of team type
     */
    getTeamType(): void {
        this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.TEAM_TYPE).pipe(
            take(1)
        ).subscribe(response => {
            this.teamTypes = response.data
        });
    }

    /**
     * get list of tech
     */
    getTechList(): void {
        this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.TECHNOLOGY).pipe(
            take(1)
        ).subscribe(response => {
           this.techList = response.data
        });
    }

    /**
     * get list of domain
     */
    getDomainList(): void {
        this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.CANDIDATE_DOMAIN).pipe(
            take(1)
        ).subscribe(response => {
            this.domainList = response.data;
        });
    }

    onSubmit(): void {
        const {value} = this.formSearch;
        const request = {
            ...value,
            name: (value.name || '').trim()
        }
        this.formSearch.patchValue(request);
        this.search.emit(value);
    }

    onCreate(): void {
        this.create.emit();
    }

}
