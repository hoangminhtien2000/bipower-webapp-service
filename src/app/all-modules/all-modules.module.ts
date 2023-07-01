import { TranslateModule } from '@ngx-translate/core';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {AllModulesComponent} from "./all-modules.component";
import {HeaderComponent} from "../sharing/header/header.component";
import {SidebarComponent} from "../sharing/sidebar/sidebar.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InMemoryWebApiModule} from "angular-in-memory-web-api";
import {AllModulesData} from "../../assets/all-modules-data/all-modules-data";
import {AllModulesRoutingModule} from "./all-modules-routing.module";
import {AllModulesService} from "./all-modules.service";
import {NgModule} from "@angular/core";
import { TimemanagementComponent } from './timemanagement/timemanagement.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
  declarations: [
    AllModulesComponent,
    HeaderComponent,
    SidebarComponent,
    TimemanagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(AllModulesData),
    PerfectScrollbarModule,
    AllModulesRoutingModule,
    TranslateModule

  ],
  providers: [
    AllModulesService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AllModulesModule { }
