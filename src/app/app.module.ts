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
import { RegisterComponent } from './register/register.component';
import { VerificationLinkComponent } from './verification-link/verification-link.component';
import { VerificationCardComponent } from './verification-card/verification-card.component';
import { UserlistComponent } from "./userlist/userlist.component";
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SocketIoModule } from "ngx-socket-io";
import { ContractpageComponent } from './contractpage/contractpage.component';
import { AuthInterceptor } from "./auth-guards/auth.interceptor";
import { ReplaceNullWithTextPipe } from "./shared/helpers/replace-null-with-text.pipe";
import { ResumeListComponent } from './resume-list/resume-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    NavbarComponent,
    LoginComponent,
    VerificationComponent,
    HiringpageComponent,
    RegisterComponent,
    VerificationLinkComponent,
    VerificationCardComponent,
    UserlistComponent,
    ProfilepageComponent,
    ContractpageComponent,
    ResumeListComponent,
    ReplaceNullWithTextPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    SocketIoModule.forRoot({url: ''}),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
