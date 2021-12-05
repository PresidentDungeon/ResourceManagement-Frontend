import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { ResumeRequest } from "../shared/models/resume-request";
import { AuthenticationService } from "../shared/services/authentication.service";
import { Contract } from "../shared/models/contract";
import { ContractService } from "../shared/services/contract.service";
import { SnackMessage } from "../shared/helpers/snack-message";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.scss"]
})

export class RequestComponent implements OnInit {

  requestForm = new FormGroup({
    contractTitle: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    occupations: new FormControl([], [Validators.required, Validators.minLength(1)])
  });

  occupationForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required])
  });

  contractSave: boolean = false;
  requestComplete: boolean = false;
  savedContract: Contract;

  occupation: ResumeRequest[] = [];

  constructor(
    private authService: AuthenticationService,
    private contractService: ContractService,
    private snackbar: SnackMessage
  ) {}

  ngOnInit() {

  }

  createContractRequest(){
    this.contractSave = true;

    const contractData = this.requestForm.value;
    const userID: number = this.authService.getID();

    const contract: Contract = {
      ID: 0,
      title: contractData.contractTitle,
      description: contractData.description,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      isVisibleToDomainUsers: false,
      status: null,
      resumeRequests: contractData.occupations,
      resumes: [],
      users: [JSON.parse(`{"ID": ${userID}}`)],
      whitelists: []
    }

    this.contractService.requestContract(contract).subscribe((contract) => {
      this.savedContract = contract;
      this.contractSave = false;
      this.requestComplete = true;},
      (error) => {this.contractSave = false; this.snackbar.open('error', error.error.message);});
  }

  createOccupation(formDirective: FormGroupDirective) {
    const occupationData = this.occupationForm.value;
    this.occupation.push({ID: 0, count: occupationData.amount, occupation: occupationData.occupation});
    this.requestForm.patchValue({occupations: this.occupation});
    this.occupationForm.reset();
    formDirective.resetForm();
  }

  removeOccupation(occupation: ResumeRequest) {
    const index: number = this.occupation.indexOf(occupation);
    this.occupation.splice(index, 1);
    this.requestForm.patchValue({occupations: this.occupation});
  }
}
