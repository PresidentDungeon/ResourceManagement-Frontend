import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "./shared.module";
import { MaterialModule } from "./material.module";
import { AdminRoutingModule } from "./routes/admin-routing.module";
import { ContractpageComponent } from "../../contractpage/contractpage.component";
import { UserListComponent } from "../../user-overview/user-list.component";
import { ContractsListComponent } from "../../contracts-list/contracts-list.component";
import { ResumeOverviewComponent } from "../../resume-overview/resume-overview.component";
import { WhitelistComponent } from "../../whitelist/whitelist.component";
import { WhitelistOverviewComponent } from "../../whitelist-domain-overview/whitelist-overview.component";
import { RegisterUserFormComponent, RegisterUserFormDialog } from "../../register-user-form/register-user-form.component";

@NgModule({
  declarations: [
    ContractpageComponent,
    UserListComponent,
    ContractsListComponent,
    ResumeOverviewComponent,
    WhitelistComponent,
    WhitelistOverviewComponent,
    RegisterUserFormComponent,
    RegisterUserFormDialog,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
