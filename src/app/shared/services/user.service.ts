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
import {Role} from "../models/role";
import {Status} from "../models/status";
import { UserPasswordUpdateDto } from '../dtos/user.password.update.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private socket: SocketManagementApp) { }

  register(loginDTO: LoginDto): Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl + '/user/register', loginDTO);
  }

  registerUsers(unregisteredUsers: User[]): Observable<User[]>{
    return this.http.post<User[]>(environment.apiUrl + '/user/registerUsers', unregisteredUsers);
  }

  getUsers(filter: string): Observable<FilterList<User>>{
    return this.http.get<FilterList<User>>(environment.apiUrl + '/user/getUsers' + filter);
  }

  getUserByID(userID: number): Observable<User>{
    return this.http.get<User>(environment.apiUrl + `/user/getUserByID?ID=${userID}`);
  }

  getUserRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(environment.apiUrl + '/user/getUserRoles');
  }

  getUserStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/user/getUserStatuses');
  }

  getUsernames(username: string): Observable<string[]>{
    return this.http.get<string[]>(environment.apiUrl + `/user/getUsernames?username=${username}`);
  }

  updateUser(user: User): Observable<User>{
    return this.http.put<User>(environment.apiUrl + '/user/updateUser', user);
  }

  updatePassword(userPasswordUpdateDTO: UserPasswordUpdateDto): Observable<boolean>{
    return this.http.put<boolean>(environment.apiUrl + '/user/updatePassword', userPasswordUpdateDTO);
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

  verifyConfirmationToken(verificationDTO: VerificationDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/verifyConfirmationToken', verificationDTO);
  }

  requestPasswordChange(passwordChangeDTO: PasswordChangeRequestDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/requestPasswordChange', passwordChangeDTO);
  }

  requestPasswordSignupChange(passwordChangeDTO: PasswordChangeRequestDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/requestPasswordSignupChange', passwordChangeDTO);
  }
}
