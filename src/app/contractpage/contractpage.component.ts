import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../shared/models/user";
import { MatDialog } from "@angular/material/dialog";
import { Resume } from "../shared/models/resume";
import { ContractService } from "../shared/services/contract.service";
import { Status } from "../shared/models/status";
import { SnackMessage } from "../shared/helpers/snack-message";
import { UserService } from "../shared/services/user.service";
import { Contract } from "../shared/models/contract";
import { ActivatedRoute, Router } from "@angular/router";
import { ResumeService } from "../shared/services/resume.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Whitelist } from "../shared/models/whitelist";

@Component({
  selector: "app-contractpage",
  templateUrl: "./contractpage.component.html",
  styleUrls: ["./contractpage.component.scss"]
})

export class ContractpageComponent implements OnInit{

  firstFormGroup = new FormGroup({
    contractTitle: new FormControl('', [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null, [Validators.required]),
    description: new FormControl('', []),
  });

  secondFormGroup = new FormGroup({
    resumes: new FormControl([], [Validators.required, Validators.minLength(1)]),
  })

  thirdFormGroup = new FormGroup({
    status: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', []),
    isVisibleToDomainUsers: new FormControl(false)
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

  selectedDomains: Whitelist[] = [];
  selectedDomainsBehaviourSubject: BehaviorSubject<Whitelist[]> = new BehaviorSubject<Whitelist[]>([]);
  selectedDomainsObservable: Observable<Whitelist[]> = this.selectedDomainsBehaviourSubject.asObservable();

  requestUserFormSubject: Subject<any> = new Subject<any>();
  requestUserFormObservable: Observable<any> = this.requestUserFormSubject.asObservable();

  contractStatuses: Status[] = [];

  isDueDateRequired: boolean = false;

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
        if(contractID == null) this.contractLoad = false},
    (error) => {if(contractID == null) this.contractLoad = false; this.snackbar.open('error', error.error.message)});

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
      endDate: contract.endDate,
      description: contract.description
    });
    this.secondFormGroup.patchValue({resumes: contract.resumes});
    this.thirdFormGroup.patchValue({status: contract.status.ID, dueDate: contract.dueDate, isVisibleToDomainUsers: contract.isVisibleToDomainUsers});
    this.contractStatusUpdate(contract.status.ID);
    this.selectedUsers = contract.users;
    this.selectedResumes = contract.resumes;
    this.selectedDomains = contract.whitelists;
    this.selectedResumesBehaviourSubject.next(contract.resumes);
    this.selectedUsersBehaviourSubject.next(contract.users);
    this.selectedDomainsBehaviourSubject.next(contract.whitelists);
  }

  updateUserCheckedList(selectedUsers: User[]){
    this.selectedUsers = selectedUsers;
  }

  updateDomainsCheckList(selectedDomains: Whitelist[]){
    this.selectedDomains = selectedDomains;
  }

  updateResumeCheckedList(selectedResumes: Resume[]){
    this.selectedResumes = selectedResumes;
    this.secondFormGroup.patchValue({resumes: selectedResumes});
  }

  remove<T>(entity: T, entityList: T[]): void {
    const index = entityList.indexOf(entity);
    if (index >= 0) {
      entityList.splice(index, 1);
    }
  }

  requestUserForm(){
    this.requestUserFormSubject.next();
  }

  addNewUser(user: User){
    this.selectedUnregisteredUsers.push(user);
  }

  contractStatusUpdate(statusID: number){

    const selectedStatusID = statusID;

    if(selectedStatusID == 3){
      console.log('here');
      this.isDueDateRequired = true;
      this.thirdFormGroup.get('dueDate').setValidators([Validators.required]);
    }
    else{
      this.isDueDateRequired = false;
      this.thirdFormGroup.get('dueDate').setValidators([]);
      this.thirdFormGroup.get('dueDate').updateValueAndValidity();
    }
  }

  saveContract() {

    this.contractSave = true;

    this.userService.registerUsers(this.selectedUnregisteredUsers).subscribe((registeredUsers) => {

      let users = [...this.selectedUsers];
      users.push(...registeredUsers);

      const firstFormData = this.firstFormGroup.value;
      const thirdFormData = this.thirdFormGroup.value;

      let dueDate: Date = (this.isDueDateRequired) ? new Date(thirdFormData.dueDate) : null
      if(dueDate){dueDate.setHours(23); dueDate.setMinutes(59); dueDate.setSeconds(59);}

      const contract: Contract = {
        ID: (this.updateView) ? this.contract.ID : 0,
        title: firstFormData.contractTitle,
        description: firstFormData.description,
        startDate: firstFormData.startDate,
        endDate: firstFormData.endDate,
        dueDate: dueDate,
        isVisibleToDomainUsers: thirdFormData.isVisibleToDomainUsers,
        status: {ID: thirdFormData.status, status: ''},
        resumeRequests: (this.updateView) ? this.contract.resumeRequests : [],
        users: users,
        resumes: this.selectedResumes,
        whitelists: (thirdFormData.isVisibleToDomainUsers) ? this.selectedDomains : []
      }

      if(this.updateView){
        this.contractService.updateContract(contract).subscribe((contract) => {
          this.snackbar.open('updated', 'Contract');
          this.router.navigate(['']);},
          (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message);},
          () => {this.contractSave = false;});
      }

      else{
        this.contractService.createContract(contract).subscribe((contract) => {
            this.snackbar.open('created', 'Contract');
            this.router.navigate(['']);},
          (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message);},
          () => {this.contractSave = false;});
      }
    },
      (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message)});
  }
}
