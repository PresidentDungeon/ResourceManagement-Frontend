import {Component, EventEmitter, OnInit} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {User} from "../shared/models/user";

@Component({
  selector: "app-contractpage",
  templateUrl: "./contractpage.component.html",
  styleUrls: ["./contractpage.component.scss"]
})

export class ContractpageComponent implements OnInit {

  firstFormGroup = new FormGroup({
    firstControl: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  contractLoad = false;
  selectable = true;
  removable = true;

  selectedUsers: User[] = [];
  selectedUnregisteredUsers: User[] = [];

  constructor() {

  }

  ngOnInit() {

  }


  updateCheckedList(selectedUsers: User[]){
    this.selectedUsers = selectedUsers;
  }

  remove(user: User, userList: User[]): void {
    const index = userList.indexOf(user);
    if (index >= 0) {
      userList.splice(index, 1);
    }
  }

}
