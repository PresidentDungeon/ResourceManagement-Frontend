import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {UserService} from "../shared/services/user.service";
import {VerificationDTO} from "../shared/dtos/verification.dto";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {PasswordChangeRequestDTO} from "../shared/dtos/password.change.request.dto";
import {MatSnackBar} from "@angular/material/snack-bar";

enum typeEnums {
  password = 'password',
  confirmation = 'confirmation',
  setup = 'setup'
}

@Component({
  selector: 'app-verification-link',
  templateUrl: './verification-link.component.html',
  styleUrls: ['./verification-link.component.scss']
})

export class VerificationLinkComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService,
              private router: Router, private snackBar: MatSnackBar) { }

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required])
  }, {validators: [this.passwordConfirming]});

  passwordConfirming(group: AbstractControl): ValidationErrors  {
    if (group.get('password').value !== group.get('passwordConfirm').value) {
      if(group.get('passwordConfirm').dirty){group.get('passwordConfirm').setErrors({'incorrect': true});}
      return {invalid: true};
    }
    else{group.get('passwordConfirm').setErrors(null);}
  }

  email: string;
  verificationCode: string;
  type: string;

  errorMessage: string;

  loading: boolean = true;
  passwordChangeLoading: boolean = false;
  successfulVerification: boolean = false;
  successfulPasswordVerification: boolean = false;
  successfulConfirmationVerification: boolean = false;
  passwordChanged: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.email = params['email'];
      this.verificationCode = params['verificationCode'];
      this.type = params['type'];
    });

    this.sendVerificationRequest();
  }

  sendVerificationRequest(){

    if(this.email == undefined || this.email == '' || this.verificationCode == undefined || this.verificationCode == ''
      || this.type == undefined || this.type == null || !(this.type in typeEnums)){
      this.errorMessage = "Invalid verification link";
      this.loading = false;
    }

    if(this.type == typeEnums.confirmation){

      const verificationDTO: VerificationDTO = {username: this.email, verificationCode: this.verificationCode};

      this.userService.confirmUserMail(verificationDTO).subscribe(() => {
          this.successfulVerification = true;},
        (error) => {this.errorMessage = error.error.message; this.loading = false;},
        () => {this.loading = false;})
    }

    else if(this.type == typeEnums.password){
      const verificationDTO: VerificationDTO = {username: this.email, verificationCode: this.verificationCode};

      this.userService.verifyPasswordToken(verificationDTO).subscribe(() => {
        this.successfulPasswordVerification = true;},
        (error) => {this.errorMessage = error.error.message; this.loading = false;},
        () => {this.loading = false;});
    }

    else if(this.type == typeEnums.setup){

      const verificationDTO: VerificationDTO = {username: this.email, verificationCode: this.verificationCode};
      this.userService.verifyConfirmationToken(verificationDTO).subscribe(() => {
          this.successfulConfirmationVerification = true;},
        (error) => {this.errorMessage = error.error.message; this.loading = false;},
        () => {this.loading = false;});
    }
  }

  sendPasswordChangeRequest(){

    this.passwordChangeLoading = true;

    const passwordData = this.passwordForm.value;
    const passwordChangeDTO: PasswordChangeRequestDTO = {username: this.email, verificationCode: this.verificationCode, password: passwordData.password}

    if(this.type == typeEnums.password){
      this.userService.requestPasswordChange(passwordChangeDTO).subscribe(success => {
          this.passwordChanged = true;},
        (error) => {this.passwordChangeLoading = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})},
        () => {this.passwordChangeLoading = false;});
    }
    else if(this.type == typeEnums.setup){
      this.userService.requestPasswordSignupChange(passwordChangeDTO).subscribe(success => {
          this.passwordChanged = true;},
        (error) => {this.passwordChangeLoading = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})},
        () => {this.passwordChangeLoading = false;});
    }


  }
}
