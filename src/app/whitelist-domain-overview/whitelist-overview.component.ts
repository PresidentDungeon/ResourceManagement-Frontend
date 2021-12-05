import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from "../shared/models/user";
import { Role } from "../shared/models/role";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { UserService } from "../shared/services/user.service";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Status } from "../shared/models/status";
import {Whitelist} from "../shared/models/whitelist";
import {WhitelistService} from "../shared/services/whitelist.service";

@Component({
  selector: 'app-whitelist-overview',
  templateUrl: './whitelist-overview.component.html',
  styleUrls: ['./whitelist-overview.component.scss']
})
export class WhitelistOverviewComponent implements OnInit{
  constructor(private snackbar: SnackMessage,
              private whitelistService: WhitelistService) { }

  @Input() SelectedDomainsObservable: Observable<Whitelist[]>;
  @Output() selectedDomainsEmitter = new EventEmitter();

  displayedColumns: string[] = ['ID', 'Domain', 'Select'];

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  snackbarRef: MatSnackBarRef<any>;

  domains: Whitelist[] = [];
  selectedDomains: Whitelist[] = [];

  ngOnInit(): void {

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getWhitelistDomains()});

    this.getWhitelistDomains();

    if(this.SelectedDomainsObservable){
      this.SelectedDomainsObservable.subscribe((selectedDomains) => {
        this.selectedDomains = selectedDomains;
      });
    }
  }

  getWhitelistDomains(): void {

    this.snackbarRef = this.snackbar.open('');

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&domain=${this.searchTerm}`;

    this.whitelistService.getWhitelists(filter).subscribe((FilterList) => {
        this.pageLength = FilterList.totalItems;
        this.domains = FilterList.list;
      },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {this.snackbarRef.dismiss();});
  }


  onPaginationChange($event){;
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getWhitelistDomains();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  checkChange(whitelist: Whitelist, $event: any){
    const checked: boolean = $event.checked;

    if(checked){this.selectedDomains.push(whitelist);}
    else{
      const index: number = this.selectedDomains.findIndex(indexWhitelist => indexWhitelist.ID == whitelist.ID);
      this.selectedDomains.splice(index, 1);
    }

    this.selectedDomainsEmitter.emit(this.selectedDomains);
  }

  isChecked(whitelist: Whitelist){
    if(this.selectedDomains.find(indexDomain => indexDomain.ID == whitelist.ID)){return true;}
    return false;
  }

}
