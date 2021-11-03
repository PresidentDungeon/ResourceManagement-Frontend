import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackMessage {

  constructor(private snackbar: MatSnackBar) { }

  open(type: string, message?: string): MatSnackBarRef<SimpleSnackBar> {
    if (type === 'error') {
      return this.snackbar.open(message, '', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000});
    } else {
      return this.snackbar.open("Loading...", '', { verticalPosition: 'top', duration: 60000 });
    }
  }
}