import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginDto } from "../shared/dtos/login.dto";
import { AuthenticationService } from "../shared/services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loginLoad: boolean = false;

  saveLogin: boolean = false;
  error: string = '';
  
  constructor( private router: Router, private location: Location, private authService: AuthenticationService) { }

  ngOnInit() {

  }

  login(): void{
    const loginData = this.loginForm.value;
    const loginDTO: LoginDto = {username: loginData.username, password: loginData.password}
    this.authService.login(loginDTO).subscribe(success => {
      if(this.saveLogin){
        this.authService.saveLogin(loginDTO);
      }
      else{
        this.authService.forgetLogin();
      }},
    error => {this.error = error.error; this.loginLoad = false;},
    () => {this.loginLoad = false; this.router.navigate(['']);});
  }
}
