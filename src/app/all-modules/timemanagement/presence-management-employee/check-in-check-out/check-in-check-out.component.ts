import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PresenceManagementService} from "../../../../core/services/presence-management.service";
import {ToastrService} from "ngx-toastr";
import {Constant} from "../../../../core/helper/presence/constants";
import {LayoutService} from '../../../../core/services/layout.service';

@Component({
    selector: 'app-check-in-check-out',
    templateUrl: './check-in-check-out.component.html',
    styleUrls: ['./check-in-check-out.component.scss']
})
export class CheckInCheckOutComponent implements OnInit {
    time = "00:00:00";
    today = new Date();
    currentTime = this.today.getHours() + ":" + this.today.getMinutes() + ":" + this.today.getSeconds();
    checkinToday = true;
    timeCurrentIsNotInvaild = true;
    @Output() checkinEvent = new EventEmitter<boolean>()
    @Output() numberCheckoutEvent = new EventEmitter<number>()
    numberCheckout = Constant.NEVER_CHECKOUT_TODAY;
    constructor(private presence: PresenceManagementService,
                private toastr: ToastrService,
                private layoutService: LayoutService) {
    }

    ngOnInit(): void {
        this.getInformationCheckinCheckoutToday();
        this.layoutService.currentMessage.subscribe(isCheckin => {
            if (isCheckin) {
                this.checkinToday = true;
                this.checkinEvent.emit(true)
            } else {
                this.numberCheckoutEvent.emit(++this.numberCheckout)
            }
        })
    }

    checkIn() {
        this.presence.checkIn().subscribe((res) => {
            if (res.success) {
                this.toastr.success(res.message);
                this.checkinToday = true;
                this.checkinEvent.emit(this.checkinToday)
            } else {
                this.toastr.error(res.message);
            }
        })
    }

    checkOut() {
        this.presence.checkOut().subscribe((res) => {
            if (res.success) {
                this.toastr.success(res.message);
                this.numberCheckoutEvent.emit(++this.numberCheckout)
            } else {
                this.toastr.error(res.message);
            }
        })
    }

    getInformationCheckinCheckoutToday() {
        this.presence.getInformationCheckinCheckoutToday().subscribe((res) => {
            if (res.success) {
                if (res.data.checkinTime == undefined) {
                    this.checkinToday = false;
                }
            }
        })
    }

    disableCheckinButton() {
        if (this.checkCheckinToday() && this.setTimeCurrentIsNotInvaild()) {
            return true;
        }
        return false;
    }

    checkCheckinToday() {
        return this.checkinToday;
    }

    setTimeCurrentIsNotInvaild() {
        if (this.getTimeCurrent() === this.time) {
            this.timeCurrentIsNotInvaild = false;
        }
        return this.timeCurrentIsNotInvaild;
    }

    getTimeCurrent() {
        return this.currentTime
    }

    disableCheckOutButton() {
        if (this.disableCheckinButton()) {
            return false;
        }
        return true;
    }
}
