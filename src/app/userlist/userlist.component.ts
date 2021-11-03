import { Component, OnInit } from '@angular/core';
import {User} from "../shared/models/user";

export interface PeriodicElement {
  username: string;
  userID: number;
  company: string;
  role: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {userID: 1, username: 'total@fakemail.com', company: 'Total', role: 'user'},
  {userID: 2, username: 'EDM@fakemail.com', company: 'EDM', role: 'user'},
  {userID: 3, username: 'SemcoAdmin@fakemail.com', company: 'Semco', role: 'admin'},
  {userID: 4, username: 'SemcoOff-Shore@fakemail.com', company: 'Semco', role: 'user'},
];

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  userlist: User[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }



}
