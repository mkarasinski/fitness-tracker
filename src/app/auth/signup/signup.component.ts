import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthdate: ['', Validators.required],
    agreement: ['', Validators.required]
  });
  public maxDate: Date;
  public isLoading = false;
  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService) { }

  public ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getFullYear() - 18);
    this.uiService.loadingStateChanged$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(isLoading => this.isLoading = isLoading);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.authService.registerUser({
        email: this.form.value.email,
        password: this.form.value.password
      });
    }
  }
}
