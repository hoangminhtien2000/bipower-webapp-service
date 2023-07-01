import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {PresenceManagementService} from "../../../../../../core/services/presence-management.service";

@Component({
    selector: 'app-list-employee-summary-tableshow',
    templateUrl: './list-employee-summary-tableshow.component.html',
    styleUrls: ['./list-employee-summary-tableshow.component.scss']
})
export class ListEmployeeSummaryTableshowComponent implements OnChanges {
    @Input() presenceList;
    pageIndex = 0;
    workingStatus = PresenceManagementService.workingStatuses;

    constructor(private translate: TranslateService) {
    }


    ngOnChanges(): void {
    }

    getWorkingType(workType: string) {
        const finder: any = this.workingStatus.find(el => el.code == workType);
        if (finder) {
            return this.translate.instant(finder.workingStatusName);
        }
        return '';
    }
}
