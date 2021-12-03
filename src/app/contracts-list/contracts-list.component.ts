import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject } from "rxjs";
import { ContractService } from "../shared/services/contract.service";
import { Contract } from "../shared/models/contract";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackMessage } from "../shared/helpers/snack-message";
import { FormControl } from "@angular/forms";
import { UserService } from "../shared/services/user.service";
import { Status } from "../shared/models/status";
import { MatDialog } from "@angular/material/dialog";
import { Comment } from "../shared/models/comment";


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit, OnDestroy {

  constructor(private contractService: ContractService,
              private userService: UserService,
              private snackbar: SnackMessage,
              private dialog: MatDialog) { }

  snackbarRef: MatSnackBarRef<any>;

  displayedColumns: string[] = ['title', 'status', 'startDate', 'endDate', 'comments'];

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  userContractSearchTerms = new Subject<string>();
  userContractSearchTerm: string = "";
  userContract = new FormControl('');
  usernames: string[] = [];
  filteredUsernames: string[] = [];
  enableMatchComplete: boolean = false;

  statuses: Status[] = [];
  selectedStatusID: number = 0;

  selectedContract: Contract;
  selectedContractComments: Comment[] = [];

  contractList: Contract[] = [];

  unsubscriber$ = new Subject();

  ngOnInit(): void {

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()).
    subscribe((search) => {this.searchTerm = search; this.getContracts(true)});

    this.userContractSearchTerms.pipe(debounceTime(300), distinctUntilChanged()).
    subscribe((search) => {this.userContractSearchTerm = search; this.getContracts(true)});

    this.userContract.valueChanges.pipe().subscribe((value) => {
      let searchTerm = value as string;
      this.userContractSearchTerms.next(searchTerm);
      this.getUsernames(searchTerm);
      this.filteredUsernames = this.usernames.filter((username) => {return username.toLowerCase().includes(searchTerm.toLowerCase())});
    });

    this.contractService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
      subscribe((contract) => {this.getContracts(false)});

    this.contractService.listenForUpdateChangeAdmin().pipe(takeUntil(this.unsubscriber$)).
    subscribe((contract) => {
      const placement = this.contractList.findIndex((contractIndex) => contractIndex.ID === contract.ID)
      if(placement !== -1){this.contractList[placement] = contract; this.contractList = [...this.contractList];}
      else{this.getContracts(false);}});

    this.getUsernames('');
    this.getStatuses();
    this.getContracts(true);
  }

  getContracts(displayLoad: boolean): void {

    if(displayLoad){this.snackbarRef = this.snackbar.open('');}

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}&contractUser=${this.userContractSearchTerm}`
    + `&statusID=${this.selectedStatusID}&enableCommentCount=true&enableMatchComplete=${this.enableMatchComplete}&sorting=ASC&sortingType=ADDED`;

    this.contractService.getContracts(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.contractList = FilterList.list;
    },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {if(displayLoad){this.snackbarRef.dismiss();}}
      )
  }

  getUsernames(username: string){
    this.userService.getUsernames(username).subscribe((usernames) => {
      this.usernames = usernames;
      this.filteredUsernames = usernames.filter((username) => {return username.toLowerCase().includes((this.userContract.value as string).toLowerCase())})
    });
  }

  getStatuses(): void{
    this.contractService.getContractStatuses().subscribe((statuses) => {
        this.statuses = statuses;},
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {})
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  onPaginationChange($event) {
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getContracts(true);
  }

  onStatusSearchChange($event){
    this.selectedStatusID = $event.value;
    this.getContracts(true);
  }

  onMatchCheckboxChange(){
    this.getContracts(true);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  getCommentsForContract(contract: Contract, template: TemplateRef<any>) {
    this.contractService.getCommentsForContract(contract.ID).subscribe((comments) => {
        this.selectedContract = contract;
        this.selectedContractComments = comments;
        this.dialog.open(template, {width: '800px', autoFocus: false});
      },
      (error) => {this.snackbar.open('error', error.error.message)});
  }
}
