import { Component, OnInit } from "@angular/core";
import {UserService} from "../shared/services/user.service";

@Component({
  selector: "app-frontpage",
  templateUrl: "./frontpage.component.html",
  styleUrls: ["./frontpage.component.scss"]
})

export class FrontpageComponent implements OnInit {

  constructor(private userService: UserService) {

  }

  ngOnInit() {}
}
