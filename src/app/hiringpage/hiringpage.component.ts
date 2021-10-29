import { Component, OnInit } from "@angular/core";
import {Employee} from "../shared/models/employee";



@Component({
  selector: "app-hiringpage",
  templateUrl: "./hiringpage.component.html",
  styleUrls: ["./hiringpage.component.scss"]
})

export class HiringpageComponent implements OnInit {
  selected: any;
  proposedList: string[] = ['Electician 1', 'Electician 2', 'Telecom 1', 'Engineer', 'Spokes Person', 'Sneakers'];


  constructor() {

  }

  ngOnInit() {

  }
}
