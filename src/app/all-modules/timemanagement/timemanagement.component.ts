import {Component, HostListener, NgZone, OnInit} from '@angular/core';

@Component({
    selector: 'app-timemanagement',
    templateUrl: './timemanagement.component.html',
    styleUrls: ['./timemanagement.component.scss']
})

@HostListener('window: resize', ['$event'])
export class TimemanagementComponent implements OnInit {
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
