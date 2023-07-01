import {NgModule} from "@angular/core";
import {CandidateListComponent} from "./candidate/candidate-list/candidate-list.component";
import {CandidateAddComponent} from "./candidate/candidate-add/candidate-add.component";
import {CandidateDetailComponent} from "./candidate/candidate-detail/candidate-detail.component";
import {CandidateAssignHrComponent} from "./candidate/candidate-assign-hr/candidate-assign-hr.component";
import {CandidateUploadCvComponent} from "./candidate/candidate-upload-cv/candidate-upload-cv.component";
import {CandidateFileComponent} from "./candidate/candidate-file/candidate-file.component";
import {CandidateImportCvComponent} from "./candidate/candidate-import-cv/candidate-import-cv.component";
import {CandidateAddOtherItemComponent} from "./candidate/candidate-add-other-item/candidate-add-other-item.component";
import {CandidateViewComponent} from "./candidate/candidate-view/candidate-view.component";
import {
    CandidateContactHistoryComponent
} from "./candidate/candidate-contact-history/candidate-contact-history.component";
import {CommonModule, DatePipe} from "@angular/common";
import {FormlyBootstrapModule} from "@ngx-formly/bootstrap";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BsDatepickerConfig, BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {CommonDirectiveModule} from "../../directives/common.directive.module";
import {MultiSelectModule} from "primeng/multiselect";
import {TranslateModule} from "@ngx-translate/core";
import {SharingModule} from "../../sharing/sharing.module";
import {UiFormModule} from "../../../libs/core";
import {NgxFileDropModule} from "ngx-file-drop";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {RecruitmentRoutingModule} from "./recruitment-routing.module";
import {RecruitmentComponent} from "./recruitment.component";
import {GeneralInfoComponent} from './candidate/general-info/general-info.component';
import {ReviewCvTabComponent} from './candidate/review-cv-tab/review-cv-tab.component';
import {AssignCvReviewerComponent} from './candidate/assign-cv-reviewer/assign-cv-reviewer.component';
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {RadioButtonModule} from "primeng/radiobutton";
import {CalendarModule} from "primeng/calendar";
import {InterviewCandidateTabComponent} from "./candidate/interview-candidate-tab/interview-candidate-tab.component";
import {
    InterviewCandidateScheduleInfoComponent
} from "./candidate/interview-candidate-schedule-info/interview-candidate-schedule-info.component";
import {RecruitmenDecisionTabComponent} from "./candidate/recruitment-decision-tab/recruitment-decision-tab.component";
import {
    DialogAddEvaluationCriteriaComponent
} from "./candidate/dialog-add-evaluation-criteria/dialog-add-evaluation-criteria.component";
import {TooltipModule} from "primeng/tooltip";
import {MatExpansionModule} from "@angular/material/expansion";

@NgModule({
    declarations: [
        RecruitmentComponent,
        CandidateListComponent,
        CandidateAddComponent,
        CandidateDetailComponent,
        CandidateAssignHrComponent,
        CandidateUploadCvComponent,
        CandidateFileComponent,
        CandidateImportCvComponent,
        CandidateAddOtherItemComponent,
        DialogAddEvaluationCriteriaComponent,
        CandidateViewComponent,
        CandidateContactHistoryComponent,
        GeneralInfoComponent,
        ReviewCvTabComponent,
        InterviewCandidateTabComponent,
        RecruitmenDecisionTabComponent,
        InterviewCandidateScheduleInfoComponent,
        AssignCvReviewerComponent],
    imports: [
        CommonModule,
        RecruitmentRoutingModule,
        FormlyBootstrapModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDatepickerModule.forRoot(),
        CommonDirectiveModule,
        MultiSelectModule,
        TranslateModule.forChild(),
        SharingModule,
        UiFormModule,
        NgxFileDropModule,
        PdfViewerModule,
        InputTextareaModule,
        InputTextModule,
        RadioButtonModule,
        CalendarModule,
        TooltipModule,
        MatExpansionModule,
        ModalModule.forChild()
    ],
    exports: [],
    providers: [BsDatepickerConfig, DatePipe, BsModalService, NgbActiveModal, {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {appearance: 'fill'}
    }]
})

export class RecruitmentModule {
}
