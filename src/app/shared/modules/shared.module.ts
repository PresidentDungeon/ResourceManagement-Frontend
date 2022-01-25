import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Socket } from "ngx-socket-io";
import {ResumeListComponent} from "../../resume-list/resume-list.component";
import {MaterialModule} from "./material.module";

@Injectable({providedIn: 'root'})
export class SocketManagementApp extends Socket {
  constructor() {
    super({ url: 'http://localhost:3100', options: {} });
  }
}

@NgModule({
  declarations: [
    ResumeListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ResumeListComponent,
    MaterialModule
  ],
  providers: [SocketManagementApp]
})

export class SharedModule { }
