import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {ContractService} from "../shared/services/contract.service";
import {User} from "../shared/models/user";
import {Contract} from "../shared/models/contract";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit {
  constructor(private contractService: ContractService) { }

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
    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}&sorting=ASC&sortingType=ADDED`;

    this.contractService.getContracts(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.contractList = FilterList.list;
    })
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
