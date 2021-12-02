import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserPasswordUpdateDto } from '../shared/dtos/user.password.update.dto';
import { SnackMessage } from '../shared/helpers/snack-message';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { AuthenticationService } from "../shared/services/authentication.service";

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})

export class ProfilepageComponent implements OnInit {

  updateForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {validators: [this.passwordConfirming]});

  user: User = null;
  userID: number;

  passwordUpdated: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackbar: SnackMessage) { }

  ngOnInit(): void {
    this.getUserByID();
  }

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

  getUserByID(){
    this.userID = this.authService.getID();
    this.userService.getUserByID(this.userID).subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  update(formDirective: FormGroupDirective): void{

    const passwordData = this.updateForm.value;

    const updatePasswordUserDTO: UserPasswordUpdateDto = {userID: this.userID, password: passwordData.password, oldPassword: passwordData.oldPassword}

    this.userService.updatePassword(updatePasswordUserDTO).subscribe(() => {
      this.passwordUpdated = true;
      formDirective.resetForm();
      this.updateForm.reset();
      this.snackbar.open('updated', 'Password')
    },
      error => {this.passwordUpdated = false; this.snackbar.open('error', error.error.message)},
      () => {this.passwordUpdated = false;});
  }
}
