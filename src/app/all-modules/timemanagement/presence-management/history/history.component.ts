import {
    Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output,
    ViewChild
} from '@angular/core';
import {Calendar, CalendarOptions} from "@fullcalendar/core";
import {FullCalendarComponent} from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {
    addPresenceDetailLink, convertEventsData,
    currentTime,
    customDays,
    customEventContent,
    customHeaderToolbar,
    getTime, hidePresenceDetailLink,
    nextMonth,
    previousMonth
} from "../../../../core/helper/presence/fullCalendar";
import {PresenceService} from "../../../../core/services/presence.service";
import {historyRequestModel} from "../../../../core/models/request/PresenceRequestModel";
import {ToastrService} from "ngx-toastr";
import {UpdatePresenceComponent} from "./update-presence/update-presence.component";
import {Constant} from "../../../../core/helper/presence/constants";
import {PresenceDetailComponent} from "./presence-detail/presence-detail.component";
import {Presence} from "../../../../core/models/presence.model";
import {EmployeeService} from "../../../../core";
import {hasRoles} from "../../../../core/helper/role";
import {ROLE_LIST} from "../../../../core/common/constant";
import {Select2OptionData} from "ng-select2";
import {UserStorage} from "../../../../core/storage/user.storage";
import {sortByEmployeeCode} from "../../../../core/helper/presence/common";
import { TranslateService } from "@ngx-translate/core";
import { transition } from "@angular/animations";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit, OnChanges {
    @Input() showHeader = true;
    @Input() isTabManager = true;
    @Input() checkinEvent;
    @Input() numberCheckoutEvent;
    user = this.userStorage.getUserInfo();
    selectedTime = currentTime();
    employeeId = null;
    myEmployeeId = null;
    employees = [];
    calendarOptions: CalendarOptions;
    public modalRef: BsModalRef;
    events: Array<Presence>;
    @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
    informationInMonth
    @Output() totalInformationInMonth = new EventEmitter<any>()

    constructor(public modalService: BsModalService,
                private presenceService: PresenceService,
                public toastrService: ToastrService,
                private employeeService: EmployeeService,
                private userStorage: UserStorage,
                private trans: TranslateService) {
    }

    ngOnChanges() {
        if (this.isCheckin()) {
            this.fetchHistory();
        }
        if (this.isCheckout()) {
            this.fetchHistory();
        }
    }

    isCheckin() {
        return this.checkinEvent;
    }

    isCheckout() {
        return this.numberCheckoutEvent > Constant.NEVER_CHECKOUT_TODAY;
    }

    ngOnInit() {
        this.initCalendar();
        if (this.isTabManager) {
            this.fetchEmployees();
        } else {
            this.fetchHistory();
        }
    }

    fetchEmployees() {
        if (this.canSearchByEmployee()) {
            this.employeeService.getEmployees().subscribe(res => {
                if (res.success) {
                    if (res.data.employeeInfoResps.length > 0) {
                        this.employees = this.customToSelect2OptionData(sortByEmployeeCode(res.data.employeeInfoResps));
                        this.employeeId = this.findStartEmployeeId(res.data.employeeInfoResps);
                        if (this.employeeId) {
                            this.fetchHistory();
                        }
                    }
                } else {
                    this.toastrService.error(res.message)
                }
            }, error => {
                this.toastrService.error(error.statusText)
            })
        }
    }

    customToSelect2OptionData(employees): Array<Select2OptionData> {
        let select2OptionData = []
        employees.forEach(employee => {
            let newSelect2Option = {
                id: String(employee.employeeId),
                text: employee.employeeCode + ' - ' + employee.lastName + ' ' + employee.firstName
            }
            select2OptionData.push(newSelect2Option);
        })
        return select2OptionData;
    }

    findStartEmployeeId(employeeInfoResps) {
        let employee = employeeInfoResps.find(employeeElement => employeeElement.employeeCode == this.user.userCode)
        if (employee) {
            this.myEmployeeId = employee.employeeId;
            return employee.employeeId;
        } else {
            return employeeInfoResps.shift().employeeId
        }
    }

    fetchHistory() {
        let body = historyRequestModel(this.selectedTime, this.employeeId);
        this.presenceService.getHistory(body).subscribe(res => {
            if (res.success) {
                this.events = convertEventsData(res.data.workingTimeDetails);
                this.informationInMonth = res.data.countEachWorkType
                this.totalInformationInMonth.emit(this.informationInMonth)
                this.initCalendar();
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })
    }

    initCalendar() {
        forwardRef(() => Calendar);
        let trans = this.trans;
        this.calendarOptions = {
            plugins: [dayGridPlugin],
            editable: true,
            displayEventTime: true,
            fixedWeekCount: false,
            contentHeight: 'auto',
            dayHeaderContent: function (args) {
                return customDays(args.text, trans)
            },
            eventClick: this.showUpdatePresenceModal.bind(this),
            headerToolbar: customHeaderToolbar(),
            dayMaxEvents: Constant.CALENDAR_OPTION.SHOW_ALL_PRESENCE,
            moreLinkClick: this.showPresenceDetailModal.bind(this),
            moreLinkContent: function (args) {
                return addPresenceDetailLink(trans);
            },
            eventContent: function (args) {
                return customEventContent(args.event,trans);
            },
            moreLinkDidMount: function (args) {
                return hidePresenceDetailLink(args);
            },
            events: this.events
        };
    }

    showUpdatePresenceModal(arg) {
        if (this.canShowUpdatePresenceModal(arg.event.extendedProps)) {
            this.updatePresenceModal(arg.event.start, arg.event._def.extendedProps);
        }
    }

    canShowUpdatePresenceModal(extendedProps) {
        if (this.isMyHistory()) {
            if (extendedProps.workTimeId != undefined) {
                return (extendedProps.workType == Constant.ATTENDANCE) &&
                    (extendedProps.status === Constant.PRESENCE_STATUS.REJECTED ||
                        extendedProps.status === Constant.PRESENCE_STATUS.PENDING ||
                        extendedProps.status === undefined ||
                        extendedProps.status === Constant.PRESENCE_STATUS.APPROVED);
            }
            return true;
        }
        return false;
    }

    isMyHistory() {
        return (!this.employeeId || this.employeeId == 'null') ||
            (this.myEmployeeId && this.employeeId && (+this.myEmployeeId == +this.employeeId));
    }

    updatePresenceModal(start, extendedProps) {
        let presence = new Presence;
        presence = {...extendedProps};
        presence.start = start;

        this.modalRef = this.modalService.show(UpdatePresenceComponent, {
            initialState: {
                presence: presence
            },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
        });
        this.modalRef.content.updatePresenceEvent.subscribe((status) => {
            if (status) {
                this.updatePresenceEvent();
            }
        });

        this.modalRef.content.addPresenceEvent.subscribe((status) => {
            if (status) {
                this.addPresenceEvent();
            }
        });
    }

    showPresenceDetailModal(arg) {
        this.modalRef = this.modalService.show(PresenceDetailComponent, {
            initialState: {
                presences: arg.allSegs
            },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
        });
    }

    addPresenceEvent() {
        this.addEvent();
    }

    updatePresenceEvent() {
        this.updateEvent();
    }

    addEvent() {
        this.fetchHistory();
    }

    updateEvent() {
        this.fetchHistory();
    }

    disableCurrentTime() {
        return this.selectedTime.month() == currentTime().month() && this.selectedTime.year() == currentTime().year()
    }

    currentTime() {
        this.selectedTime = currentTime();
        this.fetchHistory();
        this.getCalendarApi().today();
    }

    previousTime() {
        this.selectedTime = previousMonth(this.selectedTime);
        this.fetchHistory();
        this.getCalendarApi().prev();
    }

    nextTime() {
        if (!this.disableNextTime()) {
            this.selectedTime = nextMonth(this.selectedTime);
            this.fetchHistory();
            this.getCalendarApi().next();
        }
    }

    disableNextTime() {
        return this.selectedTime.month() >= currentTime().month();
    }

    renderTime() {
        return getTime(this.selectedTime);
    }

    getCalendarApi = () => {
        return this.fullcalendar.getApi();
    }

    canSearchByEmployee() {
        return (hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.COO)) && this.isTabManager;
    }

    searchByEmployee(value) {
        this.employeeId = value;
        this.fetchHistory();
    }
}
