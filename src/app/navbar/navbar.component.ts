import { Component, OnInit } from "@angular/core";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Observable} from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})

export class NavbarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {}

  loggedUser$: Observable<boolean> = this.authenticationService.userLoggedIn$;

  ngOnInit() {}
}
