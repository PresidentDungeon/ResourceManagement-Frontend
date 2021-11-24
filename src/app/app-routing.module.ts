import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HiringpageComponent } from './hiringpage/hiringpage.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './verification/verification.component';
import { RegisterComponent } from "./register/register.component";
import { VerificationLinkComponent } from "./verification-link/verification-link.component";
import { UserlistComponent } from "./userlist/userlist.component";
import { AdminAuthGuard } from "./auth-guards/admin-auth-guard";
import { UserAuthGuard } from './auth-guards/user-auth-guard';
import { ContractpageComponent } from './contractpage/contractpage.component';
import {ContractsListComponent} from "./contracts-list/contracts-list.component";
import { RequestComponent } from './request/request.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify', component: VerificationComponent},
  {path: 'verifyLink', component: VerificationLinkComponent},
  {path: 'hiring', component: HiringpageComponent},
  {path: 'users', component: UserlistComponent},
  {path: 'admin', loadChildren: () => import('./shared/modules/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard]},
  {path: 'profile', loadChildren: () => import('./shared/modules/personal.module').then(m => m.PersonalModule), canActivate: [UserAuthGuard]},
  {path: 'contract', component: ContractpageComponent},
  {path: 'contract/:id', component: ContractpageComponent},
  {path: 'contracts', component: ContractsListComponent},
  {path: 'request', component: RequestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
