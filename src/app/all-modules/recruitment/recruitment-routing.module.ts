import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {RecruitmentComponent} from "./recruitment.component";
import {CandidateListComponent} from "./candidate/candidate-list/candidate-list.component";
import {CandidateAddComponent} from "./candidate/candidate-add/candidate-add.component";
import {CandidateDetailComponent} from "./candidate/candidate-detail/candidate-detail.component";
import {CandidateUploadCvComponent} from "./candidate/candidate-upload-cv/candidate-upload-cv.component";
import {CandidateImportCvComponent} from "./candidate/candidate-import-cv/candidate-import-cv.component";
import {CandidateDownloadCvComponent} from "./candidate/candidate-download-cv/candidate-download-cv.component";

const routes: Routes = [{
    path: '',
    component: RecruitmentComponent,
    children: [{
        path: 'candidate',
        component: CandidateListComponent
        },
        {
            path: 'candidate/add',
            component: CandidateAddComponent
        },
        {
            path: 'candidate/detail',
            component: CandidateDetailComponent
        },
        {
            path: 'candidate/upload-cv',
            component: CandidateUploadCvComponent
        },
        {
            path: 'candidate/import-cv',
            component: CandidateImportCvComponent
        },
        {
            path: 'candidate/download-cv',
            component: CandidateDownloadCvComponent
        }
    ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RecruitmentRoutingModule {
}
