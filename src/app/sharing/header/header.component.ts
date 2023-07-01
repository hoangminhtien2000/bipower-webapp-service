import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {LanguageItemModel} from "../../core/models/language.item.model";
import {USER} from "../../core/common/constant";
import {OauthService} from "../../core/services/oauth.service";
import {LanguageStorage} from "../../core/storage/language.storage";
import {UserStorage} from "../../core/storage/user.storage";
import {TranslateService} from "@ngx-translate/core";
import {CONFIG} from "../../core/config/application.config";
import {LayoutService} from "../../core/services/layout.service";
import {PresenceManagementService} from "../../core/services/presence-management.service";
import {ToastrService} from "ngx-toastr";
import {Constant} from "../../core/helper/presence/constants";


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {

  languageList = CONFIG.LANGUAGE_DATA;
  constantsUser = USER;
  time = "00:00:00";
  today = new Date();
  currentTime = this.today.getHours() + ":" + this.today.getMinutes() + ":" + this.today.getSeconds();
  checkinToday = true;
  timeCurrentIsNotInvaild = true;

  constructor(private router: Router,
              private oauthService: OauthService,
              public languageStorage: LanguageStorage,
              private translateService: TranslateService,
              public layoutService: LayoutService,
              public userStorage: UserStorage,
              private presence: PresenceManagementService,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.getInformationCheckinCheckoutToday()
  }

  onSubmit() {
    this.router.navigate(["/pages/search"]);
  }

  logout() {
    this.oauthService.logout();
  }

  onChangeLanguage(language: string) {
    this.languageStorage.changeLanguage(language);
    this.translateService.use(language.toLowerCase()).subscribe(res=>{
      window.location.reload();
    });
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  disableCheckinButton() {
    if (this.checkCheckinToday() && this.setTimeCurrentIsNotInvaild()) {
      return true;
    }
    return false;
  }

  getInformationCheckinCheckoutToday() {
    this.presence.getInformationCheckinCheckoutToday().subscribe((res) => {
      if (res.success) {
        if (res.data.checkinTime == undefined) {
          this.checkinToday = false;
        }
      }
    })
  }

  checkCheckinToday() {
    return this.checkinToday;
  }

  checkIn() {
    this.presence.checkIn().subscribe((res) => {
      if (res.success) {
        this.toastr.success(res.message);
        this.checkinToday = true;
        this.layoutService.changeLoginLogout(true);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  checkOut() {
    this.presence.checkOut().subscribe((res) => {
      if (res.success) {
        this.toastr.success(res.message);
        this.layoutService.changeLoginLogout(false);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  setTimeCurrentIsNotInvaild() {
    if (this.getTimeCurrent() === this.time) {
      this.timeCurrentIsNotInvaild = false;
    }
    return this.timeCurrentIsNotInvaild;
  }

  getTimeCurrent() {
    return this.currentTime
  }

  disableCheckOutButton() {
    if (this.disableCheckinButton()) {
      return false;
    }
    return true;
  }
}
