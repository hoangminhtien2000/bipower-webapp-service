import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {COMMON, USER} from "../../core/common/constant";
import {TranslateService} from "@ngx-translate/core";
import {ToastrMessageService} from "../../core/services/toastr.message.service";
import {UserService} from "../../core";
import {ResetPasswordModel} from "../../core/models/reset.password.model";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.css"],
})
export class ForgotComponent implements OnInit {
  constantsUser = USER;
  constantsCommon = COMMON;

  form = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$')]),
    rePassword: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$')]),
  });
  togglePassword=true;
  toggleRePassword=true;

  constructor(private route: Router,
              public translate: TranslateService,
              public toastrMessage: ToastrMessageService,
              private userService: UserService) {
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {
  }
  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if(this.form.value.password != this.form.value.rePassword){
      let error: string = this.translate.instant('validations.equalsPassword', {
        'field1': this.translate.instant('user.model.new_password'),
        'field2': this.translate.instant('user.model.re_new_password').toLowerCase() });
      this.toastrMessage.showMessageError(null,
          error,
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }

    let resetPasswordModel: ResetPasswordModel = new ResetPasswordModel();
    resetPasswordModel.email = this.form.value.email.trim();
    resetPasswordModel.password = this.form.value.password.trim();
    this.userService.verifyResetPassword(resetPasswordModel).subscribe(data => {
      if (!data.status.success) {
        this.toastrMessage.showMessageError(data.status.code,
            data.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      } else {
        this.userService.getOTP(resetPasswordModel.email).subscribe(otp => {
          if (!otp.status.success) {
            this.toastrMessage.showMessageError(otp.status.code,
                otp.status.message,
                this.translate.instant('shared.common-dialog.warning.title'));
          } else {
            this.userService.makeForgot(resetPasswordModel.email, resetPasswordModel.password);
            this.route.navigate(['/login/otp']);
          }
        }, error => {
          if (error.error) {
            this.toastrMessage.showMessageError(null,
                error.error.status?.message,
                this.translate.instant('shared.common-dialog.warning.title'));
          }
        });
      }
    }, error => {
      if (error.error) {
        this.toastrMessage.showMessageError(null,
            error.error.status?.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });

  }

  iconLoglePassword() {
    this.togglePassword = !this.togglePassword;
  }

  iconLogleRePassword() {
    this.toggleRePassword = !this.toggleRePassword;
  }

  onBlurEmail() {
    let value = this.form.value.email;
    if (value && value.length > 0) {
      value = value.trim();
      this.form.controls['email'].setValue(value);
    }
  }
}
