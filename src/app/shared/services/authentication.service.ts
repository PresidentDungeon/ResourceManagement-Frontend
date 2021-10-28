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
      return this.http.post<LoginResponseDto>(environment.apiUrl + 'user/login', loginDTO)
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

    saveLogin(loginDTO: LoginDto): void{
      localStorage.setItem('loginForm', JSON.stringify({ username: loginDTO, password: loginDTO}));
    }

    forgetLogin(): void{
      localStorage.removeItem('loginForm');
    }
  }
