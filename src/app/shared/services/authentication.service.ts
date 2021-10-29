import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginDto } from "../dtos/login.dto";
import { LoginResponseDto } from "../dtos/login.response.dto";
import { User } from "../models/user";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService {

    constructor(private http: HttpClient) {}

    login(loginDTO: LoginDto): Observable<boolean> {

      return this.http.post<LoginResponseDto>(environment.apiUrl + '/user/login', loginDTO)
      .pipe(map((loginResponseDTO) => {
        if (loginResponseDTO !== null) {
          localStorage.setItem('loggedUser', JSON.stringify({token: loginResponseDTO.token}));
          return true;
        } else {
          return false;
        }
      }))
    }

    logout(): void {
      localStorage.removeItem('loggedUser');
    }

    getToken(): string {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      if (loggedUser !== null) {
        return loggedUser.token;
      } else {
        return null;
      }
    }

    validateToken(): boolean{
      const token: string = this.getToken();
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return ((Math.floor((new Date).getTime() / 1000)) <= expiry);
    }

    saveLogin(loginDTO: LoginDto): void{
      localStorage.setItem('loginForm', JSON.stringify({ username: loginDTO, password: loginDTO}));
    }

    forgetLogin(): void{
      localStorage.removeItem('loginForm');
    }

    getLoginInformation(): any{
      return JSON.parse(localStorage.getItem('loginForm'));
    }
  }
