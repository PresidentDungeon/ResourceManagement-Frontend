import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-verification-card',
  templateUrl: './verification-card.component.html',
  styleUrls: ['./verification-card.component.scss']
})
export class VerificationCardComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() showCheckmark: boolean;
  @Input() showCancel: boolean;
  @Input() showReturnLoginButton: boolean;
  @Input() showReturnFrontpageButton: boolean;
  @Input() emailBold: boolean;
  @Input() header: string;
  @Input() text: string;



  ngOnInit(): void {}

  returnToLogin(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/login']);
  }

  returnToFrontpage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/home']);
  }
}
