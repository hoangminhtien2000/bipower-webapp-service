import { CatalogItemModel } from "../catalog.item.model";

export class RecruitmentProposalModel {
    id: number;
    candidateId: number;
    netSalary: number;
    applyPositionId: number;
    proposalStatus: number;
    teamId: number;
    productivity: number;
    project: string;
    hrNote: string;
    hrLeadNote: string;
    bodNote: string;
    status: CatalogItemModel;
    
    public constructor() {

    }
}