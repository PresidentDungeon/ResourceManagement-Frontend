import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HiringpageComponent } from './hiringpage/hiringpage.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './verification/verification.component';
import {RegisterComponent} from "./register/register.component";
import {VerificationLinkComponent} from "./verification-link/verification-link.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify', component: VerificationComponent},
  {path: 'verifyLink', component: VerificationLinkComponent},
  {path: 'hiring', component: HiringpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
