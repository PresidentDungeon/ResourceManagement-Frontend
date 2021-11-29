import {Component, Input, OnInit, TemplateRef} from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Contract } from "../shared/models/contract";
import { AuthenticationService } from "../shared/services/authentication.service";
import { ContractService } from "../shared/services/contract.service";
import {Resume} from "../shared/models/resume";
import {ResumeService} from "../shared/services/resume.service";
import {BehaviorSubject, Observable} from "rxjs";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ContractStateReplyDTO} from "../shared/dtos/contract.state.reply.dto";

@Component({
  selector: "app-confirmpage",
  templateUrl: "./confirmpage.component.html",
  styleUrls: ["./confirmpage.component.scss"]
})

export class ConfirmpageComponent implements OnInit {

  snackbarRef: MatSnackBarRef<any>;
  dialogRef: MatDialogRef<any>;

  loading: boolean = false;
  isContractFinished: boolean = false;
  isContractAccepted: boolean = false;
  isContractRenewed: boolean = false;

  displaySelect: boolean = false;
  displayRenewButton: boolean = false;
  hasBeenAccepted: boolean = false;
  hasBeenCompleted: boolean = false;


  renewalLoading: boolean = false;
  hasContract: boolean = true;

  userID: number;
  contracts: Contract[] = [];
  selectedContract: Contract = null;

  selectedResumes: Resume[] = [];

  resumesToDisplayBehaviourSubject: BehaviorSubject<Resume[]> = new BehaviorSubject<Resume[]>([]);
  resumesToDisplayObservable: Observable<Resume[]> = this.resumesToDisplayBehaviourSubject.asObservable();

  originalComment: string = 'dd';
  isCommentsIdentical: boolean = false;

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });



  constructor(
    private snackbar: SnackMessage,
    private contractService: ContractService,
    private authService: AuthenticationService,
    private resumeService: ResumeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getContractsByUserID();
    this.commentForm.get('comment').valueChanges.subscribe((value) => {this.isCommentsIdentical = (value === this.originalComment) ? true : false;});
  }

  getContractsByUserID() {
    this.snackbarRef = this.snackbar.open('');
    this.userID = this.authService.getID();
    this.contractService.getContractsByUserID(this.userID).subscribe((contract) =>{
      this.contracts = contract;
      this.hasContract = (contract.length > 0) ? true : false;},
    (error) => {this.snackbar.open('error', error.error.message)},
    () => {this.snackbarRef.dismiss();});
  }

  contractSelect($event: any) {
    this.loading = true;
    let contractID: number = $event.value;

    this.contractService.getContractByIDUser(contractID).subscribe((contract) => {
      this.selectedContract = contract;
      let contractStatus: string = contract.status.status.toLowerCase();
      this.displaySelect = (contractStatus == 'pending review') ? true : false;
      this.displayRenewButton = (contractStatus == 'expired') ? true : false;
      this.hasBeenAccepted = (contractStatus == 'accepted') ? true : false;
      this.hasBeenCompleted = (contractStatus == 'completed') ? true : false;



        this.resumesToDisplayBehaviourSubject.next(contract.resumes);},
      (error) => {this.loading = false; this.snackbar.open('error', error.error.message)},
      () => {this.loading = false;})
  }

  updateResumeCheckedList($event: any) {
    this.selectedResumes = $event;
  }

  openDialog(template: TemplateRef<any>){
    this.dialogRef = this.dialog.open(template, {
      width: '300px',
      autoFocus: false
    });
  }

  confirmContract(isAccepted: boolean) {

    this.snackbarRef = this.snackbar.open('');

    let contract: Contract = this.selectedContract;
    if(isAccepted){contract.resumes = this.selectedResumes;}
    let contractStateReplyDTO: ContractStateReplyDTO = {contract: contract, isAccepted: isAccepted};

    this.contractService.confirmContractState(contractStateReplyDTO).subscribe((contract) => {

      this.isContractAccepted = isAccepted;
      this.isContractFinished = true;
    },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {this.snackbarRef.dismiss();});
  }

  requestRenewal(){

    this.snackbarRef = this.snackbar.open('');
    this.renewalLoading = true;

    this.contractService.requestRenewal(this.selectedContract).subscribe((contract) => {

        this.isContractRenewed = true;
        this.isContractFinished = true;
        this.renewalLoading = false;
      },
      (error) => {this.snackbar.open('error', error.error.message); this.renewalLoading = false;},
      () => {this.snackbarRef.dismiss();});
  }

  leaveComment() {
  }
}
