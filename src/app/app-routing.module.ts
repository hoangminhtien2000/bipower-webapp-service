import { NgModule } from "@angular/core";
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { AuthenticationGuard } from "./core/auth/authentication.guard";
import {AuthGuard} from './sharing/AuthGuard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: "login", loadChildren: () => import(`./login/login.module`).then((m) => m.LoginModule), canActivate: [AuthGuard] },
  { path: "error", loadChildren: () => import(`./errorpages/errorpages.module`).then((m) => m.ErrorpagesModule), canActivate: [AuthGuard] },
  { path: "layout", loadChildren: () => import(`./all-modules/all-modules.module`).then((m) => m.AllModulesModule), canActivate: [AuthGuard]},
  { path: "file", loadChildren: () => import(`./all-modules/file-preview/file-preview.module`).then((m) => m.FilePreviewModule), canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/layout/timemanagement/presencemanagement'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
