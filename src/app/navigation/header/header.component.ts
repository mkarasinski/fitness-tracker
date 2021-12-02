import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter();
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

  public onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  public onLogout(): void {
    this.authService.logout();
  }
}
