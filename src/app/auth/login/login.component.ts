import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public destroyed$ = new Subject<void>();
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService) { }

  ngOnInit(): void {
    this.uiService.loadingStateChanged$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(isLoading => this.isLoading = isLoading);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.authService.login({
        email: this.form.value.email,
        password: this.form.value.password
      });
    }
  }

}
