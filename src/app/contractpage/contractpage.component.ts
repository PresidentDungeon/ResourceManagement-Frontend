import {Component, EventEmitter, OnInit, TemplateRef} from "@angular/core";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {User} from "../shared/models/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RegisterDTO} from "../shared/dtos/register.dto";

@Component({
  selector: "app-contractpage",
  templateUrl: "./contractpage.component.html",
  styleUrls: ["./contractpage.component.scss"]
})

export class ContractpageComponent implements OnInit {

  registerUserForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')])
  });

  firstFormGroup = new FormGroup({
    contractTitle: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  contractLoad = false;
  selectable = true;
  removable = true;

  selectedUsers: User[] = [];
  selectedUnregisteredUsers: User[] = [];

  dialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
  ) {}

  ngOnInit() {

  }


  updateCheckedList(selectedUsers: User[]){
    this.selectedUsers = selectedUsers;
  }

  remove(user: User, userList: User[]): void {
    const index = userList.indexOf(user);
    if (index >= 0) {
      userList.splice(index, 1);
    }
  }

  openNewUserInput(template: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(template, {
      width: '300px',
      autoFocus: false
    });
  }

  addNewUser(formDirective: FormGroupDirective){
    const userToRegister: User = {ID: 0, username: this.registerUserForm.value.username, status: null, role: null}
    this.selectedUnregisteredUsers.push(userToRegister);

    this.dialogRef.close();

    formDirective.resetForm();
    this.registerUserForm.reset();
  }
}
