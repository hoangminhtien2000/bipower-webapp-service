import {Component, HostListener, NgZone, OnInit} from '@angular/core';

@Component({
    selector: 'app-recruitment',
    templateUrl: './recruitment.component.html',
    styleUrls: ['./recruitment.component.scss']
})

@HostListener('window: resize', ['$event'])
export class RecruitmentComponent implements OnInit {
    public innerHeight: any;

    getScreenHeight() {
        this.innerHeight = window.innerHeight + 'px';
    }

    constructor(private ngZone: NgZone) {
        window.onresize = (e) => {
            this.ngZone.run(() => {
                this.innerHeight = window.innerHeight + 'px';
            });
        };
        this.getScreenHeight();
    }

    ngOnInit() {
    }

    onResize(event) {
        this.innerHeight = event.target.innerHeight + 'px';
    }

}
