import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserPasswordUpdateDto } from '../shared/dtos/user.password.update.dto';
import { SnackMessage } from '../shared/helpers/snack-message';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';

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

  userID: number;
  user: User = null;

  passwordUpdated: boolean = false;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute,
    private snackbar: SnackMessage) { }

  ngOnInit(): void {
    this.userID = + this.route.snapshot.paramMap.get('id');
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
    this.userService.getUserByID(this.userID).subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  update(): void{
    
    const passwordData = this.updateForm.value;

    const updatePasswordUserDTO: UserPasswordUpdateDto = {userID: this.userID, password: passwordData.password, oldPassword: passwordData.oldPassword}

    this.userService.updatePassword(updatePasswordUserDTO).subscribe(() => {
      this.passwordUpdated = true;
      this.updateForm.reset();},
      error => {this.passwordUpdated = false; this.snackbar.open('error', error.error.message)},
      () => {this.passwordUpdated = false;});
  }
}
