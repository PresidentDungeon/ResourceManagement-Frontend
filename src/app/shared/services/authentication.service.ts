import { HttpClient } from "@angular/common/http";
import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, Observable, Subject, Subscriber} from "rxjs";
import { environment } from "src/environments/environment";
import { LoginDto } from "../dtos/login.dto";
import { LoginResponseDto } from "../dtos/login.response.dto";
import { User } from "../models/user";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService{

  private userLoggedInBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userLoggedIn$: Observable<boolean> = this.userLoggedInBehaviourSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if(token != null && token != undefined && token != '' ){this.userLoggedInBehaviourSubject.next(true);}
    else{this.userLoggedInBehaviourSubject.next(false);}
  }

  login(loginDTO: LoginDto): Observable<boolean> {
      return this.http.post<LoginResponseDto>(environment.apiUrl + '/user/login', loginDTO)
        .pipe(map((loginResponseDTO) => {
        if (loginResponseDTO !== null) {
          localStorage.setItem('loggedUser', JSON.stringify({token: loginResponseDTO.token}));
          this.userLoggedInBehaviourSubject.next(true);
          return true;
        } else {
          this.userLoggedInBehaviourSubject.next(false);
          return false;
        }
      }))
    }

    logout(): void {
      localStorage.removeItem('loggedUser');
      this.userLoggedInBehaviourSubject.next(false);
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
      localStorage.setItem('loginForm', JSON.stringify(loginDTO));
    }

    forgetLogin(): void{
      localStorage.removeItem('loginForm');
    }

    getLoginInformation(): any{
      const loginDTO: LoginDto = JSON.parse(localStorage.getItem('loginForm'));
      return loginDTO;
    }


  }
