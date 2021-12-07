import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-register-user-form',
  templateUrl: './register-user-form.component.html',
  styleUrls: ['./register-user-form.component.scss']
})

export class RegisterUserFormComponent implements OnInit {

  @Input() openInputObservable: Observable<any>;
  @Input() displayAddUserButton: boolean;
  @Output() createdUserEmitter = new EventEmitter();

  dialogRef: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {

    if (this.openInputObservable) {
      this.openInputObservable.subscribe(() => {
        this.openNewUserInput();
      });
    }

  }

  openNewUserInput() {
    this.dialogRef = this.dialog.open(RegisterUserFormDialog, {width: '300px', autoFocus: false});

    this.dialogRef.afterClosed().subscribe(username => {
      if (username != undefined) {this.createdUserEmitter.next(username);}
    });
  }

}


@Component({
  selector: 'register-user-form-dialog',
  templateUrl: 'register-user-form-dialog.component.html',
  styleUrls: ['./register-user-form-dialog.component.scss']
})
export class RegisterUserFormDialog {

  constructor(public dialogRef: MatDialogRef<RegisterUserFormDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  registerUserForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')])
  });

  addNewUser(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.registerUserForm.reset();
  }


}
