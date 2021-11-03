import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from "../shared/models/user";
import {Role} from "../shared/models/role";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {UserService} from "../shared/services/user.service";
import {RoleService} from "../shared/services/role.service";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit, OnDestroy {
  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private roleService: RoleService) { }

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 50;
  currentPage: number = 0;

  roles: Role[] = [];
  selectedRoleID: number = 0;

  status: any[] = [{name: 'All', status: ''}, {name: 'Pending', status: 'pending'}, {name: 'Active', status: 'active'}];
  selectedStatus: string = '';

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  snackbarRef: MatSnackBarRef<any>;

  userList: User[] = [];
  displayedColumns: string[] = ['ID', 'Username', 'Status', 'Role'];

  unsubscriber$ = new Subject();

  ngOnInit(): void {

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getUsers(true)});
    this.getRoles();
    this.getUsers(true);
  }

  getUsers(shouldLoad: boolean): void {

    if(shouldLoad)
    {
      this.snackbarRef = this.snackBar.open('Loading...', '', {horizontalPosition: 'center', verticalPosition: 'top', duration: 60000})
    }

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}`
      + `&roleID=${this.selectedRoleID}&status=${this.selectedStatus}&sorting=ASC&sortingType=ADDED`;

    this.userService.getUsers(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.userList = FilterList.list;},
      (error) => {this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})},
      () => {if(shouldLoad){this.snackbarRef.dismiss();} });
  }

  getRoles(): void{
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles; this.roles.splice(0, 0, {ID: 0, role: 'All'});},
      (error) => {},
      () => {})
  }

  onPaginationChange($event){
    this.currentPage = $event.pageIndex;
    console.log(this.currentPage);
  }

  onRolesChange(role: Role){
    this.selectedRoleID = role.ID;
    this.getUsers(true);
  }

  onStatusChange(status: any){
    this.selectedStatus = status.status;
    this.getUsers(true);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
