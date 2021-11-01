import {Component, OnInit, Output} from "@angular/core";
import {Location} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginDto } from "../shared/dtos/login.dto";
import { AuthenticationService } from "../shared/services/authentication.service";
import {UserService} from "../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent implements OnInit {

  constructor( private router: Router, private authService: AuthenticationService, private userService: UserService,
               private location: Location, private snackBar: MatSnackBar) { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  resetForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
  });

  loginLoad: boolean = false;
  passwordResetLoading: boolean = false;
  saveLogin: boolean = false;

  isActive: boolean = true;
  loginIsActive: boolean = true;
  passwordResetRequestIsSuccessful = false;
  inactiveErrorCode: number = 423;

  email: string = '';

  ngOnInit() {
    this.authService.logout();

    const loginInfo: LoginDto = this.authService.getLoginInformation();
    if (loginInfo !== null) {
      this.loginForm.patchValue({
        username: loginInfo.username,
        password: loginInfo.password
      });
      this.saveLogin = true;
    }
  }

  login(): void{

    this.loginLoad = true;

    const loginData = this.loginForm.value;
    const loginDTO: LoginDto = {username: loginData.username, password: loginData.password}

    this.authService.login(loginDTO).subscribe(success => {
      this.saveLoginForUser(loginDTO);},
      (error) => {

        if(error.status == this.inactiveErrorCode){
          this.email = loginData.username;
          this.isActive = false;
          this.saveLoginForUser(loginDTO);
        }
        else{
          this.loginLoad = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})
        }
      },
    () => {this.loginLoad = false; this.router.navigate(['']);});
  }

  saveLoginForUser(loginDTO: LoginDto): void{
    if(this.saveLogin){this.authService.saveLogin(loginDTO);}
    else{this.authService.forgetLogin();}
  }

  sendPasswordResetLink(): void{

    this.passwordResetLoading = true;
    const email: string = this.resetForm.value.username;

    this.userService.requestPasswordResetLink(email).subscribe(() => {
      this.passwordResetRequestIsSuccessful = true;
      this.email = email},
      (error) => {this.passwordResetLoading = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000});},
      () => {this.passwordResetLoading = false;})
  }

  forgotLoginButton(){
    this.loginIsActive = false;
  }
}
