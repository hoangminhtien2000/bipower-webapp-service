import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ROLE_LIST } from "src/app/core/common/constant";
import { TeamInfoI, TeamRoleInfoI } from "src/app/core/models/response/employeeResponse.model";
import { RoleResponseI } from "src/app/core/models/response/oauth.response.model";
declare const $: any;

@Component({
    selector: "app-team-role-modal",
    templateUrl: "./team-role-modal.component.html",
    styleUrls: ["./team-role-modal.component.css"],
})
export class TeamRoleModalComponent implements OnInit, OnChanges, AfterViewInit {
    public teamRolesForm: FormGroup;
    @Input()
    public idModal: string =  "team-role-modal";
    @Input() value: any = '';
    @Input() teams: TeamInfoI[] = [];
    @Input() oauthRoles: RoleResponseI[] = [];
    @Input() employeeId: Number = null;
    @Input() teamsSelected: any[] = [];
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    public isShow = true;

    public teamIdSelected: any = '';

    public type = 'PO';

    public teamName: string = '';
    public mapTeam: { [key: number]: TeamInfoI } = {};
    public mapRole: { [key: number]: RoleResponseI }  = {};

    public employee_confirm_approve_modal_id = 'employee_confirm_approve_modal_id';
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            this.teamRoles.clear();
            if(this.teams.length > 0 && this.oauthRoles.length > 0) {
                if(this.teamsSelected.length > 0){
                    this.isShow = false;
                    this.teamsSelected.forEach(team => {
                        this.addItem({ teamId: team.teamId, roleIds: Object.keys(team.roles).map(roleId => this.mapRole[roleId]) });
                    });
                }else{
                    this.isShow = true;
                    this.addItem();
                }
            }
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes){
            this.mapTeam = this.teams.reduce((preV, curV) => { 
                preV[curV.id] = curV;
                return preV;
            }, {});
    
            this.mapRole = this.oauthRoles.reduce((preV, curV) => { 
                preV[curV.role_id] = curV;
                return preV;
            }, {});
        }
    }

    setDefaultValue(value: any) {
        this.addItem(value);
    }

    ngOnInit() {
        this.generateFormList();
    }
    generateFormList() {
        this.teamRolesForm = this.formBuilder.group({
            list: this.formBuilder.array([])
        });
    }

    addItem(value: any = null) {
        const item = this.formBuilder.group({
            teamId: [value?.teamId ? value.teamId : "", [Validators.required]],
            roleIds: [value?.roleIds ? value.roleIds : [], [Validators.required]],
        });
        if(this.teamsSelected?.length > 0){
            item.controls['teamId'].disable();
        }
        this.teamRoles.push(item);
    }
    removeItem(index: number){
        this.teamRoles.removeAt(index);
    }

    get teamRoles() {
        return this.teamRolesForm.controls['list'] as FormArray;
    }

    loadData() {
        if(this.value && this.value.length > 0){
            for(let index = 0; index < this.value.length; index++){
                this.addItem(this.value[index]);
            }
        }else{
            this.addItem();
        }
    }

    onClickButtonSave() {
        this.teamRolesForm.markAllAsTouched();
        if (this.teamRolesForm.valid && this.validateTeamRole(this.teamRolesForm.value.list)) {
            $(`#${this.idModal}team_roles_modal_confirm`).modal("show");
        }
    }

    validateTeamRole(listTeam: any[]) {
        let result: any = this.handleConfirmCoo(listTeam);
        if(result.teams){
            const finderRolePO = this.oauthRoles.find(el => el.code == ROLE_LIST.PRODUCT_OWNER);
            const finderRoleTeamLeader = this.oauthRoles.find(el => el.code == ROLE_LIST.TEAM_LEADER);
            let listTeam = [];
            for(let team of result.teams){
                let keyTeamId = parseInt(team.teamId);
                if(this.mapTeam[keyTeamId] 
                    && this.mapTeam[keyTeamId].productOwnerEmpId
                    && team.roleIds.indexOf(finderRolePO.role_id) >= 0){
                        listTeam.push(this.mapTeam[keyTeamId].teamName);
                        if(listTeam.length > 0){
                            this.teamIdSelected = this.mapTeam[keyTeamId].id;
                            this.teamName = this.mapTeam[keyTeamId].teamName;
                            this.type = 'PO';
                            $(`#${this.idModal}team_roles_modal_warning`).modal("show");
                            return false;
                        }else{
                            this.teamIdSelected = ''
                        }
                }
                if(this.mapTeam[keyTeamId] 
                    && this.mapTeam[keyTeamId].teamLeaderEmpId
                    && team.roleIds.indexOf(finderRoleTeamLeader.role_id) >= 0){
                        listTeam.push(this.mapTeam[keyTeamId].teamName);
                        if(listTeam.length > 0){
                            this.teamIdSelected = this.mapTeam[keyTeamId].id;
                            this.teamName = this.mapTeam[keyTeamId].teamName;
                            this.type = 'LEADER';
                            $(`#${this.idModal}team_roles_modal_warning`).modal("show");
                            return false;
                        }else{
                            this.teamIdSelected = ''
                        }
                }  
            }
        }
        return true;
    }

    onCooConfirm() {
        $(`#${this.idModal}team_roles_modal_confirm`).modal("hide");
        let result = this.handleConfirmCoo(this.teamRolesForm.getRawValue().list);
        this.onSubmit.emit(result);
    }

    onClickCancel() {
        $('#' + this.idModal).modal('hide');
    }

    onClickCancelConfirm() {
        $(`#${this.idModal}team_roles_modal_confirm`).modal('hide');
    }

    handleConfirmCoo(list: any): any {
        let teams: any = list.map((team: any) => {
            const objTeam: any = {};
            objTeam.teamId = parseInt(team.teamId);
            objTeam.roleIds = team.roleIds.map(el => el.role_id);
            return objTeam;
        })
        let result: any = {
            isApproval: true,
	        note: "",
            teams: teams
        }
        return result;
    }

    onCloseModal() {
        $(`#${this.idModal}team_roles_modal_warning`).modal('hide');
    }

    onConfirmModal() {
        $(`#${this.idModal}team_roles_modal_warning`).modal('hide');
        this.onCooConfirm();
    }

}
