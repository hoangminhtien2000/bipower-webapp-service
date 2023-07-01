import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CONFIG} from '../config/application.config';
import {ApiResponse} from "../models/response.model";
import {HttpClient} from "@angular/common/http";
import { AssignCvReviewerModel } from '../models/recruitment/assign.cv.reviewer.model';
import { SaveReviewCvModel } from '../models/recruitment/save.review.cv.model';
import { SaveInterviewContactModel } from '../models/recruitment/save.interview.contact.model';
import { InterviewScheduleModel } from '../models/recruitment/interview.schedule.model';
import { InterviewEvaluationModel } from '../models/recruitment/interview.evaluation.model';
import { RecruitmentProposalModel } from '../models/recruitment/recruitment.proposal.model';
import { RejectApprovalProposalModel } from '../models/recruitment/reject.approval.proposal.model';
import { RecruitmentDecisionModel } from '../models/recruitment/recruitment.decision.model';
import { OnboardStatusModel } from '../models/recruitment/onboard.status.model';
import { RejectApprovalRecruitmentDecisionModel } from '../models/recruitment/reject.approval.recruitment.decision.model';

@Injectable({
    providedIn: 'root'
})
export class RecruitmentService {
    constructor(private http: HttpClient) {
    }

    getReviewCvResult(candidateId: number): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.GET_REVIEW_CV_RESULT, {
            candidate_id: candidateId
        });
    }

    getInterviewInfo(candidateId: number): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.GET_INTERVIEW_INFO, {
            candidateId: candidateId
        });
    }
    
    assignReviewer(assignCvReviewerModel: AssignCvReviewerModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.ASSIGN_CV_REVIEWER, assignCvReviewerModel);
    }

    saveReviewResult(saveReviewCvModel: SaveReviewCvModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.SAVE_REVIEW_CV_RESULT, saveReviewCvModel);
    }

    saveInterviewContact(saveInterviewContactModel: SaveInterviewContactModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.SAVE_INTERVIEW_CONTACT, saveInterviewContactModel);
    }


    saveInterviewSchedule(interviewScheduleModel: InterviewScheduleModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.SAVE_INTERVIEW_SCHEDULE, interviewScheduleModel);
    }

    interviewEvaluation(interviewEvaluationModel: InterviewEvaluationModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.INTERVIEW_EVALUATION, interviewEvaluationModel);
    }

    removeReviewer(id: number): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.REMOVE_CV_REVIEWER, {id: id});
    }

    createRecruitmentProposal(recruitmentProposalModel: RecruitmentProposalModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.CREATE_RECRUITMENT_PROPOSAL, recruitmentProposalModel);
    }

    rejectApprovalProposal(rejectApprovalProposalModel: RejectApprovalProposalModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.REJECT_APPROVAL_PROPOSAL, rejectApprovalProposalModel);
    }

    createRecruitmentDecision(recruitmentDecisionModel: RecruitmentDecisionModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.CREATE_RECRUITMENT_DECISION, recruitmentDecisionModel);
    }

    rejectApprovalRecruitmentDecision(rejectApprovalRecruitmentDecisionModel: RejectApprovalRecruitmentDecisionModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.REJECT_APPROVAL_RECRUITMENT_DECISION, rejectApprovalRecruitmentDecisionModel);
    }

    saveOnboardStatus(onboardStatusModel: OnboardStatusModel): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.SAVE_ONBOARD_STATUS, onboardStatusModel);
    }

    exportOffer(id: number): Observable<any> {
        return this.http.post(CONFIG.API.RECRUITMENT.EXPORT_OFFER, {id: id}, {
            responseType: 'blob',
            observe: 'response',
            headers: {'Access-Control-Expose-Headers': 'FILE_NAME'}
        });
    }

}
