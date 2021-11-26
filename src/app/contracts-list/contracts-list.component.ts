import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ContractService} from "../shared/services/contract.service";
import {User} from "../shared/models/user";
import {Contract} from "../shared/models/contract";
import {debounceTime, delay, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackMessage} from "../shared/helpers/snack-message";
import {FormControl} from "@angular/forms";
import {UserService} from "../shared/services/user.service";
import {Status} from "../shared/models/status";


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit, OnDestroy {
  constructor(private contractService: ContractService,
              private userService: UserService,
              private snackbar: SnackMessage) { }

  @Input() displayLoad: boolean;
  snackbarRef: MatSnackBarRef<any>;

  displayedColumns: string[] = ['title', 'status', 'startDate', 'endDate'];

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  userContractSearchTerms = new Subject<string>();
  userContractSearchTerm: string = "";
  usernames: string[] = [];
  filteredUsernames: string[] = [];
  userContract = new FormControl('');

  statuses: Status[] = [];
  selectedStatusID: number = 0;

  contractList: Contract[] = [];

  unsubscriber$ = new Subject();

  ngOnInit(): void {

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()).
    subscribe((search) => {this.searchTerm = search; this.getContracts()});

    this.userContractSearchTerms.pipe(debounceTime(300), distinctUntilChanged()).
    subscribe((search) => {this.userContractSearchTerm = search; this.getContracts()});

    this.userContract.valueChanges.pipe().subscribe((value) => {
      let searchTerm = value as string;
      this.userContractSearchTerms.next(searchTerm);
      this.getUsernames();
      this.filteredUsernames = this.usernames.filter((username) => {return username.toLowerCase().includes(searchTerm.toLowerCase())});
    });

    this.contractService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
      subscribe((contract) => {this.getContracts()});

    this.contractService.listenForUpdateChangeAdmin().pipe(takeUntil(this.unsubscriber$)).
    subscribe((contract) => {
      const placement = this.contractList.findIndex((contractIndex) => contractIndex.ID === contract.ID)
      if(placement !== -1){this.contractList[placement] = contract; this.contractList = [...this.contractList];}
      else{this.getContracts();}});

    this.getUsernames();
    this.getStatuses();
    this.getContracts();
  }

  getContracts(): void {

    if(this.displayLoad){this.snackbarRef = this.snackbar.open('');}

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}&contractUser=${this.userContractSearchTerm}`
    + `&statusID=${this.selectedStatusID}&sorting=ASC&sortingType=ADDED`;

    this.contractService.getContracts(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.contractList = FilterList.list;
    },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {if(this.displayLoad){this.snackbarRef.dismiss();}}
      )
  }

  getUsernames(){
    this.userService.getUsernames().subscribe((usernames) => {
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
    this.getContracts();
  }

  onStatusSearchChange($event){
    this.selectedStatusID = $event.value;
    this.getContracts();
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
