import { Component, OnInit } from '@angular/core';

export interface Worker {
  ID: number,
  name: string;
  selected: boolean;
  workField: string;
  education: string;
  diplomas: string;
  count?: number;
}

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit {

  constructor() { }

  selectedWorkers: Worker[] = [];

  ngOnInit(): void {
  }

  proposedList: Worker[] = [
    {ID: 1, name: 'Electrician 1', selected: false, workField: 'Electritian', education: 'SDU Esbjerg', diplomas: 'Safety 2018', count: 3},
    {ID: 2, name: 'Electrician 2', selected: false, workField: 'Electritian', education: 'EASV Esbjerg', diplomas: 'Safety 2020'},
    {ID: 3, name: 'Telecom 1', selected: false, workField: 'Telecom', education: 'STD Bramming 2016', diplomas: 'Safety 2018'},
    {ID: 4, name: 'Engineer', selected: false, workField: 'Engineer', education: 'DUI CPH', diplomas: 'Safety 2018'},
    {ID: 5, name: 'Spokes Person', selected: false, workField: 'Talker', education: 'DTU CPH', diplomas: 'Telecom beginner 2015'},
    {ID: 6, name: 'Sneakers', selected: false, workField: 'Sneaker', education: 'DIY Tønder', diplomas: 'Safety 2021'}
  ];

  updateCheckedList(selectedWorkers: Worker[]){
    this.selectedWorkers = selectedWorkers;
  }
}
