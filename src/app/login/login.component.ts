import { Component, OnInit } from "@angular/core";
import {Location} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginDto } from "../shared/dtos/login.dto";
import { AuthenticationService } from "../shared/services/authentication.service";
import {UserService} from "../shared/services/user.service";

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

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required])
  }, {validators: [this.passwordConfirming]});

  passwordConfirming(group: AbstractControl): ValidationErrors  {
    if (group.get('password').value !== group.get('passwordConfirm').value) {
      group.get('passwordConfirm').setErrors({'incorrect': true});
      return {invalid: true};
    }
    else{
      group.get('passwordConfirm').setErrors(null);
    }
  }

  loginLoad: boolean = false;
  registerLoad: boolean = false;

  saveLogin: boolean = false;
  loginError: string = '';
  registerError: string = '';

  constructor( private router: Router, private authService: AuthenticationService, private userService: UserService, private location: Location) { }

  ngOnInit() {
    this.authService.logout();

    const loginInfo = this.authService.getLoginInformation();
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
      if(this.saveLogin){this.authService.saveLogin(loginDTO);}
      else{this.authService.forgetLogin();}},
      (error) => {
      this.loginError = error.error; this.loginLoad = false;

      //Some check here if error is of type of status 423. IF that is the case ->



      },
    () => {this.loginLoad = false; this.router.navigate(['']);});
  }

  register(): void{

    this.registerLoad = true;

    const registerData = this.registerForm.value;
    const registerDTO: LoginDto = {username: registerData.username, password: registerData.password}

    this.userService.register(registerDTO).subscribe(success => {
        //User creation is successful - redirect to verification module here
      },
      error => {this.registerError = error.error; this.registerLoad = false;},
      () => {this.registerLoad = false;});
  }




}
