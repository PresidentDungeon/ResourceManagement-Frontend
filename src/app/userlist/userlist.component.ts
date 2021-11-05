import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from "../shared/models/user";
import {Role} from "../shared/models/role";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {UserService} from "../shared/services/user.service";
import {SnackMessage} from "../shared/helpers/snack-message";
import {Status} from "../shared/models/status";

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit, OnDestroy {
  constructor(private snackbar: SnackMessage,
              private userService: UserService) { }

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  roles: Role[] = [];
  selectableRoles: Role[] = [];
  selectedRoleID: number = 0;

  statuses: Status[] = [];
  selectableStatuses: Status[] = [];
  selectedStatusID: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  snackbarRef: MatSnackBarRef<any>;

  userList: User[] = [];
  displayedColumns: string[] = ['ID', 'Username', 'Status', 'Role'];

  unsubscriber$ = new Subject();

  ngOnInit(): void {

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getUsers()});
    this.getRoles();
    this.getStatuses();
    this.getUsers();
  }

  getUsers(): void {

    this.snackbarRef = this.snackbar.open('');

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}`
      + `&roleID=${this.selectedRoleID}&statusID=${this.selectedStatusID}&sorting=ASC&sortingType=ADDED`;

    this.userService.getUsers(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.userList = FilterList.list;
      },
      (error) => {this.snackbar.open('error', error.message.message)},
      () => {this.snackbarRef.dismiss();});
  }

  getRoles(): void{
    this.userService.getUserRoles().subscribe((roles) => {
      this.selectableRoles = [...roles];
      this.roles = roles; this.roles.splice(0, 0, {ID: 0, role: 'All'});},
      (error) => {this.snackbar.open('error', error.message.message)},
      () => {})
  }

  getStatuses(): void{
    this.userService.getUserStatuses().subscribe((statuses) => {
        this.selectableStatuses = [...statuses];
        this.statuses = statuses; this.statuses.splice(0, 0, {ID: 0, status: 'All'});},
      (error) => {this.snackbar.open('error', error.message.message)},
      () => {})
  }

  onRolesChange(userToUpdate: User, $event){
    const selectedRole: Role = {ID: $event.value, role: ''};
    userToUpdate.role = selectedRole;
    this.updateUser(userToUpdate);
  }

  onStatusChange(userToUpdate: User, $event){
    const selectedStatus: Status = {ID: $event.value, status: ''};
    userToUpdate.status = selectedStatus;
    this.updateUser(userToUpdate);
  }

  updateUser(userToUpdate: User): void{
    this.userService.updateUser(userToUpdate).subscribe((user) => {
      this.getUsers();},
      (error) => {this.snackbar.open('error', error.message.message)});
  }

  onPaginationChange($event){
    this.currentPage = $event.pageIndex;
    this.getUsers();
  }

  onRolesSearchChange(role: Role){
    this.selectedRoleID = role.ID;
    this.getUsers();
  }

  onStatusSearchChange(status: Status){
    this.selectedStatusID = status.ID;
    this.getUsers();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
