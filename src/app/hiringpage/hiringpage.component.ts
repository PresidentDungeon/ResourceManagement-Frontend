import { Component, Input, OnInit } from "@angular/core";
import {Employee} from "../shared/models/employee";

export interface Worker {
  name: string;
  selected: boolean;
  workField: string;
  education: string;
  diplomas: string;
}
const proposedList: Worker[] = [
  {name: 'Electrician 1', selected: false, workField: 'Electritian', education: 'SDU Esbjerg', diplomas: 'Safety 2018'},
  {name: 'Electrician 2', selected: false, workField: 'Electritian', education: 'EASV Esbjerg', diplomas: 'Safety 2020'},
  {name: 'Telecom 1', selected: false, workField: 'Telecom', education: 'STD Bramming 2016', diplomas: 'Safety 2018'},
  {name: 'Engineer', selected: false, workField: 'Engineer', education: 'DUI CPH', diplomas: 'Safety 2018'},
  {name: 'Spokes Person', selected: false, workField: 'Talker', education: 'DTU CPH', diplomas: 'Telecom beginner 2015'},
  {name: 'Sneakers', selected: false, workField: 'Sneaker', education: 'DIY Tønder', diplomas: 'Safety 2021'}
];

@Component({
  selector: "app-hiringpage",
  templateUrl: "./hiringpage.component.html",
  styleUrls: ["./hiringpage.component.scss"]
})

export class HiringpageComponent  {
  selected: Worker;
  displayedColumns: string[] = ['candidates', 'select'];
  dataSource = proposedList;
  selectedWorker?: Worker;
  worker: Worker;

  constructor() {

  }

  onSelect(worker: Worker): void {
    this.selectedWorker = worker;
  }
}
