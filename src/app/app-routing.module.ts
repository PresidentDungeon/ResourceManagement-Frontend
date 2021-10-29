import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HiringpageComponent } from './hiringpage/hiringpage.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './verification/verification.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'verify', component: VerificationComponent},
  {path: 'hiring', component: HiringpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
