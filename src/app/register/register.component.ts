import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../shared/services/authentication.service";
import { UserService } from "../shared/services/user.service";
import { Location } from "@angular/common";
import { SnackMessage } from '../shared/helpers/snack-message';
import { RegisterDTO } from "../shared/dtos/register.dto";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required])
  }, {validators: [this.passwordConfirming]});

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private location: Location,
    private snackbar: SnackMessage) { }

  registerLoad: boolean = false;

  isActive: boolean = true;
  email: string = '';

  ngOnInit(): void {}

  passwordConfirming(group: AbstractControl): ValidationErrors  {
    if (group.get('password').value !== group.get('passwordConfirm').value) {

      if(group.get('passwordConfirm').dirty){
        group.get('passwordConfirm').setErrors({'incorrect': true});
      }

      return {invalid: true};
    }
    else{
      group.get('passwordConfirm').setErrors(null);
    }
  }

  register(): void{

    this.registerLoad = true;

    const registerData = this.registerForm.value;
    const registerDTO: RegisterDTO = {username: registerData.username, password: registerData.password}

    this.userService.register(registerDTO).subscribe(success => {
         this.isActive = false;
         this.email = registerData.username;
      },
      error => {this.registerLoad = false; this.snackbar.open('error', error.error.message)},
      () => {this.registerLoad = false;});
  }

}
