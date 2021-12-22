import { Component, OnInit } from "@angular/core";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Observable} from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})

export class NavbarComponent implements OnInit {

  loggedUserStatus$: Observable<string>;
  userApproved$: Observable<boolean>;

  constructor(private authenticationService: AuthenticationService) {
    this.loggedUserStatus$ = this.authenticationService.userStatus$;
    this.userApproved$ = this.authenticationService.userApproved$;
  }

  ngOnInit() {}
}
