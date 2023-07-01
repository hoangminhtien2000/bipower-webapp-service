import { EvaluationCriteriaModel } from "./evaluation.criteria.model";

export class InterviewEvaluationModel {
    id: number;
    candidateId: number;
    type: string;
    levelId: number;
    workAbility: string;
    jobSuitability: string;
    teamworkAbility: string;
    longTermCommitment: string;
    salary: number;
    decision: boolean;
    evaluationCriterias: EvaluationCriteriaModel[] = [];

    public constructor() {

    }
}