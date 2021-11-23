import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { OccupationCount } from "../shared/models/occupation-count";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.scss"]
})

export class RequestComponent implements OnInit {

  requestForm = new FormGroup({
    contractTitle: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    occupations: new FormControl([], [Validators.required, Validators.minLength(1)])
  });

  occupationForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required])
  });

  occupation: OccupationCount[] = [];

  constructor() {

  }

  ngOnInit() {

  }

  createOccupation(formDirective: FormGroupDirective) {
    const occupationData = this.occupationForm.value;
    this.occupation.push({count: occupationData.amount, occupation: occupationData.occupation});
    this.requestForm.patchValue({occupations: this.occupation});
    this.occupationForm.reset();
    formDirective.resetForm();
  }

  removeOccupation(occupation: OccupationCount) {
    const index: number = this.occupation.indexOf(occupation);
    this.occupation.splice(index, 1);
    this.requestForm.patchValue({occupations: this.occupation});
  }
}
