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
import { CommentDTO } from "../shared/dtos/comment.dto";
import { Status } from "../shared/models/status";

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

  statusID: number = 0;
  statuses: Status[] = [];
  selectedStatus: Status = null;
  contracts: Contract[] = [];
  selectedContract: Contract = null;

  selectedResumes: Resume[] = [];

  resumesToDisplayBehaviourSubject: BehaviorSubject<Resume[]> = new BehaviorSubject<Resume[]>([]);
  resumesToDisplayObservable: Observable<Resume[]> = this.resumesToDisplayBehaviourSubject.asObservable();

  originalComment: string = '';
  isCommentsIdentical: boolean = false;

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });

  selectForm: FormControl = new FormControl();


  constructor(
    private snackbar: SnackMessage,
    private contractService: ContractService,
    private authService: AuthenticationService,
    private resumeService: ResumeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getContractsByUserID();
    this.getStatuses();
    this.commentForm.get('comment').valueChanges.subscribe((value) => {this.isCommentsIdentical = (value === this.originalComment) ? true : false;});
  }

  getContractsByUserID() {
    this.snackbarRef = this.snackbar.open('');
    this.contractService.getContractsByUserID(this.statusID).subscribe((contract) =>{
      this.contracts = contract;
      this.hasContract = (contract.length > 0) ? true : false;},
    (error) => {this.snackbar.open('error', error.error.message)},
    () => {this.snackbarRef.dismiss();});
  }

  getStatuses() {
    this.contractService.getAllUserStatuses().subscribe((statuses) => {
      this.statuses = [...statuses];},
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {})
  }

  contractSelect($event: any) {
    this.loading = true;
    let contractID: number = this.selectForm.value;

    this.contractService.getContractByIDUser(contractID).subscribe((contract) => {
      this.selectedContract = contract;
      let contractStatus: string = contract.status.status.toLowerCase();
      this.displaySelect = (contractStatus == 'pending review') ? true : false;
      this.displayRenewButton = (contractStatus == 'expired') ? true : false;
      this.hasBeenAccepted = (contractStatus == 'accepted') ? true : false;
      this.hasBeenCompleted = (contractStatus == 'completed') ? true : false;
      this.originalComment = contract.personalComment.comment;
      this.commentForm.patchValue({comment: contract.personalComment.comment});

      this.resumesToDisplayBehaviourSubject.next(contract.resumes);},
      (error) => {this.loading = false; this.snackbar.open('error', error.error.message)},
      () => {this.loading = false;})
  }

  contractStatusSelect(statusID: number) {
    this.selectedContract = null;
    this.displaySelect =  false;
    this.displayRenewButton = false;
    this.hasBeenAccepted = false;
    this.hasBeenCompleted = false;
    this.selectForm.patchValue(null);
    this.statusID = statusID;
    this.getContractsByUserID();
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
    let comment: string = this.commentForm.value.comment;
    let commentDTO: CommentDTO = {comment: comment, contractID: this.selectedContract.ID, userID: this.statusID};
    this.contractService.saveComment(commentDTO).subscribe(() => {
      this.snackbar.open('updated', 'Comment');
      this.originalComment = comment;
      this.isCommentsIdentical = true;
    },
    (error) => {this.snackbar.open('error', error.error.message); this.renewalLoading = false;})
  }
}
