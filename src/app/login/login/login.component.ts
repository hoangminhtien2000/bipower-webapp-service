import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {COMMON, USER} from "../../core/common/constant";
import {LanguageStorage} from "../../core/storage/language.storage";
import {OauthService} from "../../core/services/oauth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {CONFIG} from "../../core/config/application.config";
import { ToastrMessageService } from "src/app/core/services/toastr.message.service";
import {UserStorage} from "../../core/storage/user.storage";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constantUser = USER;
  constantCommon = COMMON;

  customControler;
  toggledata=true;
  languageList = CONFIG.LANGUAGE_DATA;


  form = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private router: Router,
              public languageStorage: LanguageStorage,
              private translate: TranslateService,
              private oauthService: OauthService,
              private userStorage: UserStorage,
              private toastrMessage: ToastrMessageService){

  }

  ngOnInit() {
  }

  submit() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.oauthService.login(this.form.value.email.trim(), this.form.value.password.trim(), 'password', null).subscribe(
        (data: any) => {
          if (!data.status.success) {
            this.toastrMessage.showMessageError(data.status.code,
                data.status.message,
                this.translate.instant('shared.common-dialog.warning.title'));
          } else {
              if(this.userStorage.getNextUrl() && this.userStorage.getNextUrl().length > 0){
                location.href = this.userStorage.getNextUrl();
              } else {
                this.router.navigate([USER.URL_LOGIN_SUCCESS]);
              }
          }
        },
        error => {
          this.toastrMessage.showMessageError(null, this.translate.instant('user.message.login'),
              this.translate.instant('shared.common-dialog.warning.title'));
        }
    );
  }
  
  ngOnDestroy() {
  }

  iconLogle(){
    this.toggledata = !this.toggledata
  }

  onChangeLanguage(key: string) {
    this.languageStorage.changeLanguage(key.toLowerCase());
    this.translate.use(key.toLowerCase()).subscribe(res => {
      window.location.reload();
    });
  }

  onBlurEmail() {
    let value = this.form.value.email;
    if (value && value.length > 0) {
      value = value.trim();
      this.form.controls['email'].setValue(value);
    }
  }
}
