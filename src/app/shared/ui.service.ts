import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class UIService {

  constructor(private snackbar: MatSnackBar) { }

  public loadingStateChanged$ = new Subject<boolean>();

  public showSnackbar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, { duration });
  }
}
