import {Injectable} from "@angular/core";
import {UserStorage} from "../../core/storage/user.storage";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TeamValidator {

    constructor(private userStorage: UserStorage,
                private toastService: ToastrService) {
    }

    validateRole(requiredRole: any[]): boolean {
        const userRole = this.userStorage.getUserRoles() as any[];
        const accept = userRole.some(role => requiredRole.includes(role.code));
        return accept;
    }

    validatePermission(requirePermissions: string[], showError = true) {
        const userPermission = this.userStorage.getPermissions() as string[];
        const accept = requirePermissions.length == 0 || userPermission.some(permission => requirePermissions.includes(permission));
        if (!accept && showError) {
            this.showNotPermissionMessage();
        }
        return accept;
    }

    handleResponseError(error: HttpErrorResponse): void {
        const {status} = error.error;
        if (!error) {
            return;
        }
        this.toastService.error(status.message);
    }

    showNotPermissionMessage(): void {
        this.toastService.error('Bạn không có quyền thực hiện chức năng này. Vui lòng kiểm tra lại');
    }

}