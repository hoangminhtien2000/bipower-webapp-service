import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Role, Team} from "../../../../core/models/team.model";
import {Router} from "@angular/router";
import {UserStorage} from "../../../../core/storage/user.storage";
import {ROLE_LIST} from "../../../../core/common/constant";
import {ConfirmDeleteTeamComponent} from "../confirm-delete-team/confirm-delete-team.component";
import {filter, take, takeUntil} from "rxjs/operators";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormControl, FormGroup} from "@angular/forms";
import {TeamService} from "../../../../core/services/team.service";

@Component({
    selector: 'app-team-table',
    templateUrl: './team-table.component.html',
    styleUrls: ['./team-table.component.css']
})
export class TeamTableComponent implements OnInit, OnChanges{

    @Input() teamList: Team[] = [];
    @Input() page = 0;
    @Input() size = 0;
    @Input() summary = {
        average_effort: 0,
        total_member: 0,
        total_productivity: 0,
        total_salary: 0
    };
    displayList: any[] = [];
    canViewSalary = false;

    constructor(public router: Router,
                private teamService: TeamService,
                private modalService: BsModalService,
                private userStorage: UserStorage) {
    }

    ngOnInit(): void {
        const roles = (this.userStorage.getUserRoles() as any[]) || [];
        const allowViewSalaryRole = [
            ROLE_LIST.COO, ROLE_LIST.C_B, ROLE_LIST.COO,
            ROLE_LIST.CEO, ROLE_LIST.PRM_LEADER, ROLE_LIST.PRM,
            ROLE_LIST.TEAM_LEADER
        ]
        this.canViewSalary = roles.some(role => allowViewSalaryRole.includes(role.code));

    }

    // fillDataToForm(team: Team): void {
    //     // mapping data from api info to options
    //     const teamType = this.teamTypeOption.find(option => option.item_id === this.teamInfo.team_type_id) || this.teamInfo.team_type;
    //     const techs = this.teamInfo.technologies.map(el => {
    //         const find = this.techOptions?.find(tech => {
    //             return tech.item_id === el.technology.item_id;
    //         });
    //         return find ? find : el.technology
    //     });
    //
    //     const domains = this.teamInfo.domains.map(domain => {
    //         const find = this.domainOptions?.find(option => option.item_id === domain.domain.item_id);
    //         return find ? find : domain.domain
    //     });
    //     const lead = this.teamLeadOptions?.find(option => option.id === this.teamInfo.team_lead_id) || null;
    //     const po = this.POOptions?.find(option => option.id === this.teamInfo.po_id) || null;
    //
    //     // fill data
    //     this.formTeam.patchValue({
    //         // team_id: team.team_id,
    //         // name: team.name,
    //         type: teamType,
    //         po: po,
    //         teamLead: lead,
    //         domain: domains,
    //         tech: techs,
    //         project: team.projects,
    //         customer: team.customers,
    //         description: team.note,
    //     });
    //     this.employeeList = this.teamInfo.members.map(el => ({
    //         id: el.member.id,
    //         code: el.member.employeeCode,
    //         productivity: el.member?.effort,
    //         salary: el.member?.fullSalary,
    //         role: el.roleMembers.map(role => {
    //             const find = this.roleList.find(el => el.role_id === role.role_id);
    //             return find ? find : role;
    //         }),
    //         fullName: `${el?.member?.lastName} ${el?.member?.firstName}`,
    //         effort_rate: el.effort_rate,
    //         chipLabel: el?.member?.companyEmail.match(/^([^@]*)@/)[1],
    //         display: `${this.getCompanyAccount(el?.member?.companyEmail)} - ${el?.member?.lastName} ${el?.member?.firstName}`
    //     }));
    //
    //     setTimeout(() => {
    //         this.formTeam.valueChanges.pipe(
    //             takeUntil(this.unsubscribe$),
    //         ).subscribe(value => {
    //             this.canExit = false;
    //         })
    //     });
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['teamList'] && this.teamList) {
            this.displayList = this.teamList.map(team => ({
                ...team,
                domains: team.domains.map(el => el.domain.name).join(', '),
                technologies: team.technologies.map(el => el.technology.name).join(', ')
            }))
        }
    }

    openConfirmDelete(team:Team): void {
        const ref = this.modalService.show(ConfirmDeleteTeamComponent, {
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        ref.content.confirmSubject$.pipe(
            filter(val => !!val),
            take(1)
        ).subscribe(confirm => {
            this.teamService.deleteTeam(team).subscribe()
        })

    }

}
