import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from "../shared/models/user";
import { Role } from "../shared/models/role";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { UserService } from "../shared/services/user.service";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Status } from "../shared/models/status";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit{
  constructor(private snackbar: SnackMessage,
              private userService: UserService) { }

  @Input() isSelectable: boolean;
  @Input() displayLoad: boolean = true;
  @Input() displayAddUser: boolean = true;
  @Input() selectedUsersObservable: Observable<User[]>;
  @Output() selectedUsersEmitter = new EventEmitter();

  displayedColumnsWithSelect: string[] = ['ID', 'Username', 'Status', 'Role', 'Select'];
  displayedColumnsWithoutSelect: string[] = ['ID', 'Username', 'Status', 'Role'];

  displayedColumns: string[] = ['ID', 'Username'];


  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  roles: Role[] = [];
  selectedRoleID: number = 0;

  statuses: Status[] = [];
  selectedStatusID: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  snackbarRef: MatSnackBarRef<any>;

  userList: User[] = [];
  selectedUsers: User[] = [];

  ngOnInit(): void {
    this.displayedColumns = (this.isSelectable) ? this.displayedColumnsWithSelect : this.displayedColumnsWithoutSelect;

    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getUsers()});
    this.getRoles();
    this.getStatuses();
    this.getUsers();

    if(this.selectedUsersObservable){
      this.selectedUsersObservable.subscribe((selectedUsers) => {
        this.selectedUsers = selectedUsers;
      });
    }
  }

  getUsers(): void {

    if(this.displayLoad){this.snackbarRef = this.snackbar.open('');}

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.searchTerm}`
      + `&roleID=${this.selectedRoleID}&statusID=${this.selectedStatusID}&sorting=ASC&sortingType=ADDED`;

    this.userService.getUsers(filter).subscribe((FilterList) => {
      this.pageLength = FilterList.totalItems;
      this.userList = FilterList.list;
      },
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {if(this.displayLoad){this.snackbarRef.dismiss();}});
  }

  getRoles(): void{
    this.userService.getUserRoles().subscribe((roles) => {
      this.roles = [...roles];},
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {})
  }

  getStatuses(): void{
    this.userService.getUserStatuses().subscribe((statuses) => {
        this.statuses = [...statuses];},
      (error) => {this.snackbar.open('error', error.error.message)},
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
      (error) => {this.snackbar.open('error', error.error.message)});
  }

  onPaginationChange($event){;
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getUsers();
  }

  onRolesSearchChange($event){
    this.selectedRoleID = $event.value;
    this.getUsers();
  }

  onStatusSearchChange($event){
    this.selectedStatusID = $event.value;
    this.getUsers();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  checkChange(user: User, $event: any){
    const checked: boolean = $event.checked;

    if(checked){
      this.selectedUsers.push(user);
    }
    else{
      const index: number = this.selectedUsers.findIndex(indexUser => indexUser.ID == user.ID);
      this.selectedUsers.splice(index, 1);
    }

    this.selectedUsersEmitter.emit(this.selectedUsers);
  }

  isChecked(user: User){
    if(this.selectedUsers.find(indexUser => indexUser.ID == user.ID)){
      return true;
    }
    return false;
  }

  addUser(userToAdd: User){
    this.userService.registerUsers([userToAdd]).subscribe((registeredUsers) => {
      this.getUsers();},
      (error) => {this.snackbar.open('error', error.error.message);});
  }

}
