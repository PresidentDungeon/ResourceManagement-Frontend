import {Component, EventEmitter, OnInit, TemplateRef} from "@angular/core";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {User} from "../shared/models/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RegisterDTO} from "../shared/dtos/register.dto";
import {Resume} from "../shared/models/resume";
import {ContractService} from "../shared/services/contract.service";
import {Status} from "../shared/models/status";
import {SnackMessage} from "../shared/helpers/snack-message";

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

  secondFormGroup = new FormGroup({
    resumes: new FormControl([], [Validators.required, Validators.minLength(1)]),
  })

  thirdFormGroup = new FormGroup({
    status: new FormControl('', [Validators.required]),
  })

  contractLoad = false;
  selectable = true;
  removable = true;

  selectedUsers: User[] = [];
  selectedUnregisteredUsers: User[] = [];

  selectedResumes: Resume[] = [];

  contractStatuses: Status[] = [];

  dialogRef: MatDialogRef<any>;

  constructor(
    private snackbar: SnackMessage,
    private dialog: MatDialog,
    private contractService: ContractService) {}

  ngOnInit() {
    this.contractService.getContractStatuses().subscribe((statuses) => {
      this.contractStatuses = statuses;},
    (error) => {this.snackbar.open('error', error.error.message)});
  }

  updateUserCheckedList(selectedUsers: User[]){
    this.selectedUsers = selectedUsers;
  }

  updateResumeCheckedList(selectedResumes: Resume[]){
    this.selectedResumes = selectedResumes;

    this.secondFormGroup.patchValue({resumes: selectedResumes});
  }

  remove(user: User, userList: User[]): void {
    const index = userList.indexOf(user);
    if (index >= 0) {
      userList.splice(index, 1);
    }
  }

  removeResume(resume: Resume): void {
    const index = this.selectedResumes.indexOf(resume);
    if (index >= 0) {
      this.selectedResumes.splice(index, 1);
    }

    this.secondFormGroup.patchValue({resumes: this.selectedResumes});
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
