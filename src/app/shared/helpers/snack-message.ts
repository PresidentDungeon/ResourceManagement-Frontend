import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackMessage {

  constructor(private snackbar: MatSnackBar) { }

  open(type: string, message?: string): MatSnackBarRef<SimpleSnackBar> {
    if (type === 'general') {
      return this.snackbar.open(message, '', { verticalPosition: 'top', duration: 2000 });
    }
  }
}