import { EmployeeModel } from "../employee/employee.model";
import { UserModel } from "../user.model";
import { InterviewEvaluationModel } from "./interview.evaluation.model";
import { RecruitmentProposalModel } from "./recruitment.proposal.model";

export class InterviewScheduleModel {
    candidateId: number;
    interviewFromTime: string;
    interviewToTime: string;
    title: string;
    placeId: number;
    interviewTypeId: number;
    hrId: number;
    hrInfo: UserModel;
    interviewerId: number;
    interviewerIdList: any[] = [];
    interviewerInfo: EmployeeModel[] = [];
    interviewLink: string;
    description: string;
    id: number;
    currentSalary: number;
    expectSalary: number;
    onboardTime: string;
    isJoined: boolean;
    note: string;
    interviewResults: InterviewEvaluationModel[] = [];
    proposals: RecruitmentProposalModel[] = [];

    public constructor() {
    }
}
