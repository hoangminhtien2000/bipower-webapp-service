import { CatalogItemModel } from "../catalog.item.model";

export class RecruitmentDecisionModel {
    id: number;
    candidateId: number;
    contractTypeId: number;
    contractPeriodId: number;
    startWorkDate: string;
    officialSalary: number;
    probationarySalary: number;
    basicSalary: number;
    negotiableSalary: number;
    proposedSalary: number;
    workingPlaceId: number;
    workingTimeId: number;
    compensationBenefit: string;
    effortReview: string;
    otherIncome: string;
    training: string;
    otherBenefit: string;
    jobDescription: string;
    contactUserId: number;
    contactUserPhone: string;
    contactUserEmail: string;
    inchargeHrNote: string;
    status: number;
    statusItem: CatalogItemModel;
    hrLeadNote: string;
    candidateResponse: boolean;
    estimatedOnboardDate: string;
    onboardStatus: boolean;
    onboardDate: string;
    rejectReason: string;
    rejectOnboardReason: string;
    effort: number;

    public constructor() {

    }
}
