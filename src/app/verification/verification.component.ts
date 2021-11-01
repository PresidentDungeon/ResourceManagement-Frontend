import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {UserService} from "../shared/services/user.service";
import {LoginDto} from "../shared/dtos/login.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {VerificationDTO} from "../shared/dtos/verification.dto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.scss"]
})

export class VerificationComponent implements OnInit {

  constructor(private userService: UserService, private snackBar: MatSnackBar,
              private router: Router) {}

  @Input() email: string;

  verificationForm = new FormGroup({
    verificationCode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  emailHasBeenResend: boolean = false;
  sendLoading: boolean = false;
  resendLoading: boolean = false;

  emailVerified: boolean = false

  ngOnInit() {}

  confirmVerificationCode(){

    this.sendLoading = true;

    const verificationData = this.verificationForm.value;
    const verificationDTO: VerificationDTO = {username: this.email, verificationCode: verificationData.verificationCode}

    this.userService.confirmUserMail(verificationDTO).subscribe(() => {
      this.emailVerified = true;
      },
      (error) => {this.sendLoading = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})},
      () => {this.sendLoading = false;});
  }

  resendVerificationMail(){
    this.resendLoading = true;

    this.userService.resendConfirmationMail(this.email).subscribe(success => {
        this.emailHasBeenResend = true;},
      (error) => {this.resendLoading = false; this.snackBar.open(error.error.message, 'ok', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000})},
      () => {this.resendLoading = false;});
  }

  returnToLogin(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/login']);
  }

}
