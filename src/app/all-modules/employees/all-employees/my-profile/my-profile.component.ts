import {DatePipe} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CANDIDATE, COMMON, USER} from "../../../../core/common/constant";
import {UserStorage} from "../../../../core/storage/user.storage";
import {UserService} from "../../../../core";
import {TranslateService} from "@ngx-translate/core";
import {ChangePasswordModel} from "../../../../core/models/change.password.model";

declare const $: any;

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"]
})
export class MyProfileComponent implements OnInit {
  constantsUser = USER;
  constantsCandidate = CANDIDATE;
  constantsCommon = COMMON;
  userRoles: string = '';
  customControler: any;
  toggleOldPassword=true;
  togglePassword=true;
  toggleRePassword=true;

  form = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$')]),
    rePassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$')]),
  });

  constructor(
    private route: Router,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private toastrService: ToastrService,
    public userStorage: UserStorage,
    private userService: UserService,
  ) {
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.updateUserRoles();
  }

  private updateUserRoles() {
    let userRoles = '';
    for (var role of this.userStorage.getUserRoles()) {
      if (userRoles.length > 0) {
        userRoles = userRoles + ', ';
      }
      userRoles = userRoles + role.code;
      let roleName = role.name;
      if (roleName.length > 0) {
        userRoles = userRoles + ' (' + roleName + ')';
      }
    }
    this.userRoles = userRoles;
  }

  changePassword() {
    this.customControler = 0;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if(this.form.value.password != this.form.value.rePassword){
      let error: string = this.translate.instant('validations.equalsPassword', {
        'field1': this.translate.instant('user.model.new_password'),
        'field2': this.translate.instant('user.model.re_new_password').toLowerCase() });
      this.toastrService.error(error, this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }

    let changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
    changePasswordModel.password = this.form.value.password.trim();
    changePasswordModel.old_password = this.form.value.oldPassword.trim();
    this.userService.changePassword(changePasswordModel).subscribe(data => {
      if (!data.status.success) {
        this.toastrService.error(data.status.message, this.translate.instant('shared.common-dialog.warning.title'));
      } else {
        this.toastrService.success(data.status.message, this.translate.instant('shared.common-dialog.info.title'));
        this.form.reset();
      }
    }, error => {
      if (error.error) {
        this.toastrService.error(error.error.status?.message, this.translate.instant('shared.common-dialog.warning.title'));
      }
    });

  }

  iconLoglePassword() {
    this.togglePassword = !this.togglePassword;
  }

  iconLogleOldPassword() {
    this.toggleOldPassword = !this.toggleOldPassword;
  }

  iconLogleRePassword() {
    this.toggleRePassword = !this.toggleRePassword;
  }
  
}
