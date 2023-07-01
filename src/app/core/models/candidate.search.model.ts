import {CandidateRequestModel} from "./candidate.request.model";
import {PageModel} from "./page.model";

export class CandidateSearchModel {
    request: CandidateRequestModel;
    page: PageModel;
    constructor() {
        this.request = new CandidateRequestModel();
        this.page = new PageModel();
    }
}
