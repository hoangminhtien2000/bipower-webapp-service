import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ERROR_STATUS } from "../common/constant";

@Injectable({
    providedIn: "root",
})
export class ToastrMessageService {
    constructor(public toastrService: ToastrService) {
    }

    public showMessageError(code: string, message: string, title: string): void {
        if (ERROR_STATUS.WRONG.AUTHORIZATION == code) {
            return;
        }

        if (ERROR_STATUS.ACCESS_TOKEN.EXPIRED == code) {
            return;
        }
        this.toastrService.error(message, title);
    }

    public showMessageSuccess(message: string, title: string): void {
        this.toastrService.success(message, title);
    }

    public setToastrService(toastrService: ToastrService): void {
        this.toastrService = toastrService;
    }

    public showMessageErrorHttp(error: any, title: string){
        if(error.error.message){
            this.toastrService.error(error.error.message, title);
            return;
        }
    }

}
