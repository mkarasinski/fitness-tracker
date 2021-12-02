import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {

  constructor(private router: Router) { }

  public authChange = new Subject<boolean>();
  private user: User;

  public registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authSuccesfully();
  }

  public login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authSuccesfully();
  }

  public logout(): void {
    this.user = null;
    this.authChange.next(false);
    this.router.navigateByUrl('login');
  }

  public getUser(): User {
    return { ...this.user };
  }

  public isAuth(): boolean {
    return this.user != null;
  }

  private authSuccesfully(): void {
    this.authChange.next(true);
    this.router.navigateByUrl('training');
  }
}
