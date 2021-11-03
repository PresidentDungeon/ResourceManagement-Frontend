import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../dtos/login.dto";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {VerificationDTO} from "../dtos/verification.dto";
import {PasswordChangeRequestDTO} from "../dtos/password.change.request.dto";
import {User} from "../models/user";
import {FilterList} from "../models/filterList";
import {SocketManagementApp} from "../modules/shared.module";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private socket: SocketManagementApp) { }

  register(loginDTO: LoginDto): Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl + '/user/register', loginDTO);
  }

  getUsers(filter: string): Observable<FilterList<User>>{
    return this.http.get<FilterList<User>>(environment.apiUrl + '/user/getUsers' + filter);
  }

  confirmUserMail(verificationDTO: VerificationDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/verifyUser', verificationDTO);
  }

  resendConfirmationMail(email: string): Observable<void>{
    return this.http.get<void>(environment.apiUrl + `/user/resendVerificationMail?email=${email}`);
  }

  requestPasswordResetLink(email: string): Observable<void>{
    return this.http.get<void>(environment.apiUrl + `/user/requestPasswordMail?email=${email}`);
  }

  verifyPasswordToken(verificationDTO: VerificationDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/verifyPasswordToken', verificationDTO);
  }

  requestPasswordChange(passwordChangeDTO: PasswordChangeRequestDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/requestPasswordChange', passwordChangeDTO);
  }


  listenForCreate(): Observable<User>{
    return this.socket.fromEvent<User>('userCreated');
  }

  listenForUpdateChange(): Observable<User>{
    return this.socket.fromEvent<User>('userUpdated');
  }

  listenForDeleteChange(): Observable<User>{
    return this.socket.fromEvent<User>('userDeleted');
  }

  registerUser(): void{
    this.socket.emit('register', {data: 'someValue'});
  }






}
