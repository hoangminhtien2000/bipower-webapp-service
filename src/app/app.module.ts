import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {  CalendarDateFormatter, CalendarNativeDateFormatter} from "angular-calendar";

// Bootstrap DataTable
import {DataTablesModule} from 'angular-datatables';
import {CookieService} from "ngx-cookie-service";
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core';
import {SharedModule} from 'primeng/api';
import {SpinnerComponent} from "./sharing/sprinner/spinner.component";
import {InterceptorModule} from "./intercepter.module";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";
import {CONFIG} from "./core/config/application.config";
import {MatDialogModule} from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import {SharingModule} from "./sharing/sharing.module";
import {
    UnsubscribeOvertimeComponent
} from "./all-modules/timemanagement/overtime-management/unsubscribe-overtime/unsubscribe-overtime.component";

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
        UnsubscribeOvertimeComponent
    ],
    imports: [
        FormsModule,
        MatDialogModule,
        BrowserModule,
        CoreModule,
        SharedModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        HttpClientModule,
        SharingModule,
        InterceptorModule.forRoot(),
        NgxDaterangepickerMd.forRoot(),
        ToastrModule.forRoot(
            {
                timeOut: 3000,
                positionClass: 'toast-bottom-right',
                preventDuplicates: true,
            }
        ),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            }
        }),
        FullCalendarModule
    ],
    providers: [
        CookieService,
        {provide: CalendarDateFormatter, useClass: CalendarNativeDateFormatter}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, CONFIG.LANGUAGE);
}
