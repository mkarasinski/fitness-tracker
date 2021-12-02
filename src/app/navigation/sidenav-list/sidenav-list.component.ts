import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeSidenav = new EventEmitter();
  public isAuth = false;
  private destroyed$: Subject<void> = new Subject();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(authStatus => {
        this.isAuth = authStatus;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public onSidenavClose(): void {
    this.closeSidenav.emit();
  }

  public onLogout(): void {
    this.authService.logout();
    this.onSidenavClose();
  }
}
