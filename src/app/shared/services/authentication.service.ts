import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginDTO } from "../dtos/loginDTO";
import { LoginResponseDTO } from "../dtos/loginResponseDTO";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService{

  private userStatusBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public userStatus$: Observable<string> = this.userStatusBehaviourSubject.asObservable();

  private userApprovedBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userApproved$: Observable<boolean> = this.userApprovedBehaviourSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if(token != null && token != undefined && token != '' ){
      this.userStatusBehaviourSubject.next(this.getRole());
      this.verifyUserApproved();
    }
    else{this.userStatusBehaviourSubject.next(null);}
  }

  login(loginDTO: LoginDTO): Observable<boolean> {
    return this.http.post<LoginResponseDTO>(environment.apiUrl + '/user/login', loginDTO)
      .pipe(map((loginResponseDTO) => {
        if (loginResponseDTO !== null) {
          localStorage.setItem('loggedUser', JSON.stringify({token: loginResponseDTO.token}));
          this.userStatusBehaviourSubject.next(this.getRole());
          this.verifyUserApproved();
          return true;
        } else {
          this.userStatusBehaviourSubject.next(null);
          return false;
        }
      }))
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
    this.userStatusBehaviourSubject.next(null);
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

  getRole(): string{
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser !== null){
      return JSON.parse(atob(loggedUser.token.split('.')[1])).role;
    }
    else{
      return null;
    }
  }

  getID(): number{
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser !== null){
      return JSON.parse(atob(loggedUser.token.split('.')[1])).userID;
    }
    else{
      return null;
    }
  }

  saveLogin(loginDTO: LoginDTO): void{
    localStorage.setItem('loginForm', JSON.stringify(loginDTO));
  }

  forgetLogin(): void{
    localStorage.removeItem('loginForm');
  }

  getLoginInformation(): any{
    const loginDTO: LoginDTO = JSON.parse(localStorage.getItem('loginForm'));
    return loginDTO;
  }

  verifyAdmin(): Observable<void>{
    return this.http.get<void>(environment.apiUrl + '/user/verifyAdmin');
  }

  verifyUserApproved(): void{
    this.http.get<boolean>(environment.apiUrl + '/user/verifyUserApprovedStatus').subscribe((isApproved) => {
      this.userApprovedBehaviourSubject.next(isApproved);
    });
  }

}
