import {Injectable, isDevMode, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Socket} from "ngx-socket-io";

@Injectable({providedIn: 'root'})
export class SocketManagementApp extends Socket {
  constructor() {
    super({ url: 'http://localhost:3100', options: {} });
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [SocketManagementApp]
})

export class SharedModule { }
