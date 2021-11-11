import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HiringpageComponent } from './hiringpage/hiringpage.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './verification/verification.component';
import { RegisterComponent } from "./register/register.component";
import { VerificationLinkComponent } from "./verification-link/verification-link.component";
import { UserlistComponent } from "./userlist/userlist.component";
import { ProfilepageComponent } from "./profilepage/profilepage.component";
import { AdminAuthGuard } from "./auth-guards/admin-auth-guard";
import { ContractpageComponent } from './contractpage/contractpage.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify', component: VerificationComponent},
  {path: 'verifyLink', component: VerificationLinkComponent},
  {path: 'hiring', component: HiringpageComponent},
  {path: 'table', component: UserlistComponent},
  {path: 'admin', loadChildren: () => import('./shared/modules/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard]},
  {path: 'profilepage/:id', component: ProfilepageComponent},
  {path: 'contract', component: ContractpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
