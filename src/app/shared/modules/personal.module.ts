import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "./shared.module";
import { MaterialModule } from "./material.module";
import { PersonalRoutingModule } from "./routes/personal-routing.module";
import { ConfirmpageComponent } from "../../confirmpage/confirmpage.component";
import { ProfilepageComponent } from "../../profilepage/profilepage.component";
import { RequestComponent } from "../../request/request.component";
import {ResumeListComponent} from "../../resume-list/resume-list.component";

@NgModule({
  declarations: [
    ConfirmpageComponent,
    ProfilepageComponent,
    RequestComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    PersonalRoutingModule
  ]
})
export class PersonalModule { }
