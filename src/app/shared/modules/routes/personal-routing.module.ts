import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmpageComponent } from 'src/app/confirmpage/confirmpage.component';
import { RequestComponent } from 'src/app/request/request.component';
import { ProfilepageComponent } from '../../../profilepage/profilepage.component';

const routes: Routes = [
  {path: 'profile', component: ProfilepageComponent},
  {path: 'confirm', component: ConfirmpageComponent},
  {path: 'request', component: RequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
