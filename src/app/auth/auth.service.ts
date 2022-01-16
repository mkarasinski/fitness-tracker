import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {

  public authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private trainingService: TrainingService,
    private ui: UIService) { }

  public initAuthListener(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigateByUrl('training');
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigateByUrl('login');
        this.isAuthenticated = false;
      }
    });
  }

  public registerUser(authData: AuthData): void {
    this.ui.loadingStateChanged$.next(true);
    this.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(() => {
      this.ui.loadingStateChanged$.next(false);
    }).catch(error => {
      this.ui.loadingStateChanged$.next(false);
      this.ui.showSnackbar(error.message, null, 3000);
    });
  }

  public login(authData: AuthData): void {
    this.ui.loadingStateChanged$.next(true);
    this.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(() => {
      this.ui.loadingStateChanged$.next(false);
    }).catch(error => {
      this.ui.loadingStateChanged$.next(false);
      this.ui.showSnackbar(error.message, null, 3000);
    });
  }

  public logout(): void {
    this.auth.signOut();
  }

  public isAuth(): boolean {
    return this.isAuthenticated;
  }
}
