import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "./shared.module";
import { MaterialModule } from "./material.module";
import { PersonalRoutingModule } from "./routes/personal-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    PersonalRoutingModule
  ]
})
export class PersonalModule { }
