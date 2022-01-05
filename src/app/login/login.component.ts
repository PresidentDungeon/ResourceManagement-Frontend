import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginDTO } from "../shared/dtos/loginDTO";
import { AuthenticationService } from "../shared/services/authentication.service";
import { UserService } from "../shared/services/user.service";
import { SnackMessage } from "../shared/helpers/snack-message";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent implements OnInit {

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

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private location: Location,
    private snackbar: SnackMessage) { }

  ngOnInit() {
    this.authService.logout();

    const loginInfo: LoginDTO = this.authService.getLoginInformation();
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
    const loginDTO: LoginDTO = {username: loginData.username, password: loginData.password}

    this.authService.login(loginDTO).subscribe(success => {
      this.saveLoginForUser(loginDTO);},
      (error) => {

        if(error.status == this.inactiveErrorCode){
          this.email = loginData.username;
          this.isActive = false;
          this.saveLoginForUser(loginDTO);
        }
        else{
          this.loginLoad = false; this.snackbar.open('error', error.error.message)
        }
      },
    () => {this.loginLoad = false; this.router.navigate(['']);});
  }

  saveLoginForUser(loginDTO: LoginDTO): void{
    if(this.saveLogin){this.authService.saveLogin(loginDTO);}
    else{this.authService.forgetLogin();}
  }

  sendPasswordResetLink(): void{

    this.passwordResetLoading = true;
    const email: string = this.resetForm.value.username;

    this.userService.requestPasswordResetLink(email).subscribe(() => {
      this.passwordResetRequestIsSuccessful = true;
      this.email = email},
      (error) => {this.passwordResetLoading = false; this.snackbar.open('error', error.error.message);},
      () => {this.passwordResetLoading = false;})
  }

  forgotLoginButton(){
    this.loginIsActive = false;
  }
}
