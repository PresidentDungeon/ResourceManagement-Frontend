import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/modules/shared.module";
import { MaterialModule } from './shared/modules/material.module';

import { AppComponent } from './app.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VerificationComponent } from './verification/verification.component';
import { HiringpageComponent } from './hiringpage/hiringpage.component';

import { AuthInterceptor } from "./auth-guards/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    NavbarComponent,
    LoginComponent,
    VerificationComponent,
    HiringpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MaterialModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
