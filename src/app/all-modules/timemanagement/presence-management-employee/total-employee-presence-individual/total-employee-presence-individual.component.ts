import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-total-employee-presence-individual',
    templateUrl: './total-employee-presence-individual.component.html',
    styleUrls: ['./total-employee-presence-individual.component.scss']
})
export class TotalEmployeePresenceIndividualComponent implements OnInit {
    @Input() workingStatus: string;

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }
}
