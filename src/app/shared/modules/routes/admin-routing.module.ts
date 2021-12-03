import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractpageComponent } from 'src/app/contractpage/contractpage.component';
import { ContractsListComponent } from 'src/app/contracts-list/contracts-list.component';
import { WhitelistComponent } from 'src/app/whitelist/whitelist.component';
import { ResumeOverviewComponent } from '../../../resume-overview/resume-overview.component';
import { UserlistComponent } from "../../../userlist/userlist.component";

const routes: Routes = [
  {path: 'users', component: UserlistComponent},
  {path: 'contract', component: ContractpageComponent},
  {path: 'contract/:id', component: ContractpageComponent},
  {path: 'contracts', component: ContractsListComponent},
  {path: 'resumes', component: ResumeOverviewComponent},
  {path: 'whitelist', component: WhitelistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
