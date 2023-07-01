import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NotifyType} from "../../core/common/notify-type";

export class DataConfirmDialog {
    title: string;
    btnClosed: string;
    btnConfirm?: string;
    message: string;
    icon: string;
    styleClass: string;
    messageParams: object;
}

@Component({
    selector: 'app-common-dialog',
    templateUrl: './common-dialog.component.html',
    styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

    dataDisp: DataConfirmDialog;

    configDialog = {
        'info': {
            title: 'shared.common-dialog.info.title',
            btnClosed: 'shared.common-dialog.info.btn-closed',
            message: '',
            styleClass: NotifyType.info,
            icon: 'Info.png'
        },
        'error': {
            title: 'shared.common-dialog.error.title',
            btnClosed: 'shared.common-dialog.error.btn-closed',
            btnConfirm: '',
            message: '',
            styleClass: NotifyType.error,
            icon: 'Error.png'
        },
        'warning': {
            title: 'shared.common-dialog.warning.title',
            btnClosed: 'shared.common-dialog.warning.btn-closed',
            btnConfirm: 'shared.common-dialog.warning.btn-confirm',
            message: '',
            styleClass: NotifyType.warn,
            icon: 'Warning.png'
        },
        'success': {
            title: 'shared.common-dialog.success.title',
            btnClosed: 'shared.common-dialog.success.btn-closed',
            message: '',
            styleClass: NotifyType.success,
            icon: 'Success.png'
        }
    };

    modalRef: BsModalRef;
    optionData: any;
    optionDialog = {
        title: '',
        btnClosed: '',
        btnConfirm: '',
        message: 'Do you know what you are doing?',
        type: 'warning',
        messageParams: {}
    };
    @Output() confirmAction = new EventEmitter();

    @ViewChild('template') template: TemplateRef<any>;

    constructor(private modalService: BsModalService) {
        this.dataDisp = new DataConfirmDialog();
    }

    ngOnInit() {
    }

    openModal(template?: TemplateRef<any>, optionData?: any, optionDialog?: any) {
        const modalExist = document.getElementsByClassName('modal-common-dialog');
        if (modalExist.length > 0) {
            return;
        } else {
            this.optionData = optionData;
            if (optionDialog) {
                this.optionDialog = optionDialog;
                this.dataDisp = this.configDialog[this.optionDialog.type];
                this.dataDisp.message = this.optionDialog.message;
                this.dataDisp.messageParams = this.optionDialog.messageParams;
                //
                if (this.optionDialog.title) {
                    this.dataDisp.title = this.optionDialog.title;
                }
                //
                if (this.optionDialog.btnClosed == 'hide') {
                    this.dataDisp.btnClosed = '';
                } else if (this.optionDialog.btnClosed) {
                    this.dataDisp.btnClosed = this.optionDialog.btnClosed;
                }
                //
                if (this.optionDialog.btnConfirm == 'hide') {
                    this.dataDisp.btnConfirm = '';
                } else if (this.optionDialog.btnConfirm) {
                    this.dataDisp.btnConfirm = this.optionDialog.btnConfirm;
                }
            }
            const temp = template ? template : this.template;
            this.modalRef = this.modalService.show(temp, {
                class: 'modal-dialog-centered modal-common-dialog',
                ignoreBackdropClick: true
            });
        }
    }

    confirm(event): void {
        event.stopPropagation();
        this.modalRef.hide();
        this.confirmAction.emit(this.optionData);
    }

    decline(): void {
        // Thực hiện set thuộc tính isRender = false;
        if (this.optionData && this.optionData.onHide) {
            this.optionData.onHide();
        }
        this.modalRef.hide();
        // Thực hiện remove element by class thay vì phải đợi render lại xong.
        const modalExist = document.getElementsByClassName('modal-common-dialog');
        if (modalExist && modalExist.length > 0) {
            modalExist[0].remove();
        }
    }

}
