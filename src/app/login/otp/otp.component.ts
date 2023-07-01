import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {USER} from "../../core/common/constant";
import {UserStorage} from "../../core/storage/user.storage";
import {UserService} from "../../core";
import {TranslateService} from "@ngx-translate/core";
import {ToastrMessageService} from "../../core/services/toastr.message.service";

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  constantsUser = USER;

  form = new FormGroup({
    otp: new FormControl('', [Validators.required]),
  });
  constructor(private route: Router,
              private userService: UserService,
              public userStorage: UserStorage,
              public toastrMessage: ToastrMessageService,
              public translate: TranslateService) { }

  ngOnInit() {
    this.startTimer();
  }

  submit() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.userService.confirmOTP(this.form.value.otp.trim()).subscribe(data => {
      if (!data.status.success) {
        this.toastrMessage.showMessageError(data.status.code,
            data.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      } else {
        this.toastrMessage.showMessageSuccess(data.status.message, this.translate.instant('shared.common-dialog.info.title'));
        this.route.navigate(['/login']);
      }
    }, error => {
      if (error.error) {
        this.toastrMessage.showMessageError(null,
            error.error.status?.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });

  }

  timeLeft: number = 30;
  interval;

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      }
    },1000)
  }

  restartTimer() {
    this.timeLeft = 30;
    this.startTimer();
  }

  resenOTP() {
    if (this.timeLeft > 0) {
      return;
    }
    this.userService.getOTP(this.userStorage.getRequestOTPEmail()).subscribe(data=>{
      if (!data.status.success) {
        this.toastrMessage.showMessageError(data.status.code,
            data.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      } else {
        $("reSendOTP").removeClass("text-muted");
        clearInterval(this.interval);
        this.restartTimer();
      }
    }, error => {
      if (!error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });

  }

  onBlurOtp() {
    let value = this.form.value.otp;
    if (value && value.length > 0) {
      value = value.trim();
      this.form.controls['otp'].setValue(value);
    }
  }


  get f() {
    return this.form.controls;
  }

}
