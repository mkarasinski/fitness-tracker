import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigateByUrl('login');
    }
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
