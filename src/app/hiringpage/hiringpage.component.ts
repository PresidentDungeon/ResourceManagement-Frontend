import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Contract } from "../shared/models/contract";
import { AuthenticationService } from "../shared/services/authentication.service";
import { ContractService } from "../shared/services/contract.service";

@Component({
  selector: "app-hiringpage",
  templateUrl: "./hiringpage.component.html",
  styleUrls: ["./hiringpage.component.scss"]
})

export class HiringpageComponent implements OnInit {

  snackbarRef: MatSnackBarRef<any>;

  userID: number;
  contracts: Contract[] = [];

  constructor(
    private snackbar: SnackMessage,
    private contractService: ContractService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getContractByUserID();
  }

  getContractByUserID() {
    this.snackbarRef = this.snackbar.open('');
    this.userID = this.authService.getID();
    this.contractService.getContractByUserID(this.userID).subscribe((contract) =>{
      this.contracts = contract;
    },
    (error) => {this.snackbar.open('error', error.error.message)},
    () => {this.snackbarRef.dismiss();});
  }
  
}
