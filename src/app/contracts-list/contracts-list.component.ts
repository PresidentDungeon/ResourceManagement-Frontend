import {Component, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ContractService} from "../shared/services/contract.service";
import {User} from "../shared/models/user";
import {Contract} from "../shared/models/contract";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackMessage} from "../shared/helpers/snack-message";


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit {
  constructor(private contractService: ContractService,
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

  contractList: Contract[] = [];

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getContracts()});

    this.getContracts();
  }

  getContracts(): void {

    if(this.displayLoad){
      this.snackbarRef = this.snackbar.open('');
    }

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}&sorting=ASC&sortingType=ADDED`;

    this.contractService.getContracts(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.contractList = FilterList.list;
    },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {if(this.displayLoad){this.snackbarRef.dismiss();}}
      )
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  onPaginationChange($event) {
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getContracts();
  }


}
