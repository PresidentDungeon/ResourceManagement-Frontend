import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../dtos/login.dto";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../../environments/environment";
import {VerificationDTO} from "../dtos/verification.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(loginDTO: LoginDto): Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl + '/user/register', loginDTO);
  }

  confirmUserMail(verificationDTO: VerificationDTO): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/user/verifyUser', verificationDTO);
  }


}
