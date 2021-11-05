import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AdminAuthGuard implements CanActivate{

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(): boolean{

    if(this.authService.getToken() !== null && this.authService.validateToken() && this.authService.getRole().toLocaleLowerCase() === 'admin'){
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}


