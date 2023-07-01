import {Component, OnDestroy, OnInit} from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import {UserStorage} from "../../core/storage/user.storage";
import {ObjectsModel} from "../../core/models/objects.model";
import {LayoutService} from "../../core/services/layout.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit , OnDestroy{
  urlComplete = {
    mainUrl: "",
    subUrl: "",
    childUrl: "",
  };

  url: string = "";

  sidebarMenus = {
    default: true,
    chat: false,
    settings: false,
  };

  members = {};
  groups = {};
  menu: ObjectsModel[] = [];
  opening: number = null;

  constructor(
    private router: Router,
    private allModulesService: AllModulesService,
    public userStorage: UserStorage,
    private layoutService: LayoutService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        $(".main-wrapper").removeClass('slide-nav');
        $(".sidebar-overlay").removeClass('opened');
        const url = event.url.split("/");
        this.url = event.url;
        this.urlComplete.mainUrl = url[2];
        this.urlComplete.subUrl = url[3];
        this.urlComplete.childUrl = url[4];
        if (url[2] === "") {
          this.urlComplete.mainUrl = "dashboard";
          this.urlComplete.subUrl = "admin";
        }

        if (url[3] === "chat" || url[3] === "calls") {
          this.sidebarMenus.chat = true;
          this.sidebarMenus.default = false;
        } else {
          this.sidebarMenus.chat = false;
          this.sidebarMenus.default = true;
        }

        this.findAndOpenCurrentMenu();
      }
    });

    this.groups = { ...this.allModulesService.groups };
    this.members = { ...this.allModulesService.members };
  }

  toggleMenu(objectId: number) {
    this.opening = objectId;
  }

  submenuClass(objectId: number): any {
    const open = this.layoutService.sidebarOpen$.value;
    const expand = document.body.classList.contains('expand-menu');
    const show = (open || expand) && this.opening == objectId;
    return {
      'frame-menu': true,
      'frame-menu-show': show
    }
  }

  ngOnInit() {
    this.menu = this.userStorage.getUserMenu();
    this.findAndOpenCurrentMenu();
  }

  ngOnDestroy() {
  }

  findAndOpenCurrentMenu(): void {
    this.menu.forEach(menu => {
      if (this.url.includes(menu.url)) {
        this.opening = menu.objectId;
      }
    })
  };

  setActive(member) {
    this.allModulesService.members.active = member;
  }
}
