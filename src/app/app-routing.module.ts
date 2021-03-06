import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './verification/verification.component';
import { RegisterComponent } from "./register/register.component";
import { VerificationLinkComponent } from "./verification-link/verification-link.component";
import { AdminAuthGuard } from "./auth-guards/admin-auth-guard";
import { UserAuthGuard } from './auth-guards/user-auth-guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify', component: VerificationComponent},
  {path: 'verifyLink', component: VerificationLinkComponent},
  {path: 'admin', loadChildren: () => import('./shared/modules/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard]},
  {path: 'user', loadChildren: () => import('./shared/modules/personal.module').then(m => m.PersonalModule), canActivate: [UserAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
