import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {WhitelistService} from "../shared/services/whitelist.service";
import {Whitelist} from "../shared/models/whitelist";
import {SnackMessage} from "../shared/helpers/snack-message";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../shared/models/user";

@Component({
  selector: "app-whitelist",
  templateUrl: "./whitelist.component.html",
  styleUrls: ["./whitelist.component.scss"]
})

export class WhitelistComponent implements OnInit {

  constructor(
    private whitelistService: WhitelistService,
    private snackbar: SnackMessage,
    private dialog: MatDialog
  ) {}

  whitelists: Whitelist[] = [];
  snackbarRef: MatSnackBarRef<any>;

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  dialogRef: MatDialogRef<any>;
  isCreatePage: boolean = true;
  isSaveLoading: boolean = false;
  selectedWhitelistUpdate: Whitelist;

  mockWhitelist: Whitelist = {ID: 1, domain: '@gmail.com'}

  whitelistForm = new FormGroup({
    domain: new FormControl('@', [Validators.required, Validators.pattern('^@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
  });

  ngOnInit() {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getWhitelists(true)});

    this.getWhitelists(true);
  }

  getWhitelists(displayLoad: boolean){

    if(displayLoad){this.snackbarRef = this.snackbar.open('');}

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&domain=${this.searchTerm}`;

    this.whitelistService.getWhitelists(filter).subscribe((FilterList) => {
        this.pageLength = FilterList.totalItems;
        this.whitelists = FilterList.list;
      },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {if(displayLoad){this.snackbarRef.dismiss();}});
  }

  onPaginationChange($event){;
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getWhitelists(true);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  openCreateInput(template: TemplateRef<any>) {
    this.isCreatePage = true;
    this.whitelistForm.reset();
    this.whitelistForm.patchValue({domain: '@'});
    this.dialogRef = this.dialog.open(template, {width: '500px', autoFocus: false});
  }

  openUpdateInput(whitelist: Whitelist, template: TemplateRef<any>) {
    this.isCreatePage = false;
    this.selectedWhitelistUpdate = whitelist;
    this.whitelistForm.patchValue({domain: whitelist.domain});
    this.dialogRef = this.dialog.open(template, {width: '500px', autoFocus: false});
  }

  createWhitelist(){
    this.isSaveLoading = true;

    let whitelistData = this.whitelistForm.value;
    let whiteList: Whitelist = {ID: 0, domain: whitelistData.domain};

    this.whitelistService.createWhitelist(whiteList).subscribe((whiteList) => {
      this.snackbar.open('created','Whitelist domain');
      this.getWhitelists(false);
      this.isSaveLoading = false;
      this.dialogRef.close();
      }, (error) => {this.isSaveLoading = false; this.snackbar.open('error', error.error.message)});
  }

  updateWhitelist(){
    this.isSaveLoading = true;

    let whitelistData = this.whitelistForm.value;
    let whitelistToUpdate: Whitelist = Object.assign(this.selectedWhitelistUpdate);
    whitelistToUpdate.domain = whitelistData.domain;

    this.whitelistService.updateWhitelist(whitelistToUpdate).subscribe((whiteList) => {
      this.snackbar.open('updated','Whitelist domain');
      this.getWhitelists(false);
      this.isSaveLoading = false;
      this.dialogRef.close();
    }, (error) => {this.isSaveLoading = false; this.snackbar.open('error', error.error.message)});
  }


}
