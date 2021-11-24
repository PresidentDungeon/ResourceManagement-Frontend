import {Component, EventEmitter, OnInit, TemplateRef} from "@angular/core";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {User} from "../shared/models/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Resume} from "../shared/models/resume";
import {ContractService} from "../shared/services/contract.service";
import {Status} from "../shared/models/status";
import {SnackMessage} from "../shared/helpers/snack-message";
import {UserService} from "../shared/services/user.service";
import {Contract} from "../shared/models/contract";
import {ActivatedRoute, Router} from "@angular/router";
import {ResumeService} from "../shared/services/resume.service";
import {BehaviorSubject, Observable} from "rxjs";

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

  contractLoad = true;
  updateView = false;
  invalidID = false;

  contractSave = false;
  selectable = true;
  removable = true;

  contract: Contract = null;

  selectedUsers: User[] = [];
  selectedUnregisteredUsers: User[] = [];
  selectedUsersBehaviourSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  selectedUsersObservable: Observable<User[]> = this.selectedUsersBehaviourSubject.asObservable();

  selectedResumes: Resume[] = [];
  selectedResumesBehaviourSubject: BehaviorSubject<Resume[]> = new BehaviorSubject<Resume[]>([]);
  selectedResumesObservable: Observable<Resume[]> = this.selectedResumesBehaviourSubject.asObservable();

  contractStatuses: Status[] = [];

  dialogRef: MatDialogRef<any>;

  constructor(
    private snackbar: SnackMessage,
    private dialog: MatDialog,
    private contractService: ContractService,
    private resumeService: ResumeService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {

    let contractID = this.route.snapshot.paramMap.get('id');

    this.contractService.getContractStatuses().subscribe((statuses) => {
      this.contractStatuses = statuses;
      this.contractLoad = (contractID == null) ? false : true;},
    (error) => {this.contractLoad = (contractID == null) ? false : true; this.snackbar.open('error', error.error.message)});

    if(contractID != null){
      this.updateView = true;

      this.contractService.getContractByID(+contractID).subscribe((contract) => {
        this.contract = contract;
        this.initializeContract(this.contract);
        this.contractLoad = false;},
        (error) => {this.invalidID = true; this.contractLoad = false; this.snackbar.open('error', error.error.message);});
    }
  }

  initializeContract(contract: Contract){
    this.firstFormGroup.patchValue({
      contractTitle: contract.title,
      startDate: contract.startDate,
      endDate: contract.endDate
    });
    this.secondFormGroup.patchValue({resumes: contract.resumes});
    this.thirdFormGroup.patchValue({status: contract.status.ID});
    this.selectedUsers = contract.users;
    this.selectedResumes = contract.resumes;
    this.selectedResumesBehaviourSubject.next(contract.resumes);
    this.selectedUsersBehaviourSubject.next(contract.users);
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

  saveContract() {

    /*
        We first save new users
        We then get the values from selectedUsers and merge with the newly created users
        We then create the contract and save to the backend
    */

    this.contractSave = true;

    this.userService.registerUsers(this.selectedUnregisteredUsers).subscribe((registeredUsers) => {

      let users = [...this.selectedUsers];
      users.push(...registeredUsers);

      const firstFormData = this.firstFormGroup.value;
      const thirdFormData = this.thirdFormGroup.value;

      const contract: Contract = {
        ID: (this.updateView) ? this.contract.ID : 0,
        title: firstFormData.contractTitle,
        description: (this.updateView) ? this.contract.description: '',
        startDate: firstFormData.startDate,
        endDate: firstFormData.endDate,
        status: {ID: thirdFormData.status, status: ''},
        resumeRequests: (this.updateView) ? this.contract.resumeRequests: [],
        users: users,
        resumes: this.selectedResumes
      }

      if(this.updateView){
        this.contractService.updateContract(contract).subscribe((contract) => {
          this.router.navigate(['']);},
          (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message);},
          () => {this.contractSave = false;});
      }

      else{
        this.contractService.createContract(contract).subscribe((contract) => {
            this.router.navigate(['']);},
          (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message);},
          () => {this.contractSave = false;});
      }
    },
      (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message)});
  }
}
