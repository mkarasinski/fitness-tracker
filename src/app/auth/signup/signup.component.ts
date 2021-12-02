import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthdate: ['', Validators.required],
    agreement: ['', Validators.required]
  });

  public maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) { }

  public ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getFullYear() - 18);
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
