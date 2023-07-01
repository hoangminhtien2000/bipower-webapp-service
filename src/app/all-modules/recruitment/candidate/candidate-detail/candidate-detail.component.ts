import {Component, OnDestroy, OnInit} from "@angular/core";
import {CandidateService} from "../../../../core";
import {CandidateModel} from "../../../../core/models/candidate.model";
import {take} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-candidate-detail',
    templateUrl: './candidate-detail.component.html',
    styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit, OnDestroy {

    currentTab: number = 1;
    candidateInfo: CandidateModel;

    constructor(private candidateService: CandidateService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.getCandidateDetail();
    }

    ngOnDestroy() {
    }

    changeTab(newTab: number): void {
        this.currentTab = newTab;
    }

    getCandidateDetail(): void {
        let candidateId: string =  this.candidateService.getCandidateDetailId();
        let queryQ = this.activatedRoute.snapshot.queryParamMap.get('q');
        if (queryQ) {
            candidateId = atob(queryQ);
        }
        if (!candidateId) {
            return;
        }
        this.candidateService.detailByCandidateId(candidateId).pipe(
            take(1)
        ).subscribe(response => {
            this.candidateInfo = response.data;
        })
    }

    resetTab(): void {
        const currentTab = this.currentTab;
        this.currentTab = null;
        this.getCandidateDetail();
        setTimeout(() => {
            this.currentTab = currentTab;
        });
    }

}
