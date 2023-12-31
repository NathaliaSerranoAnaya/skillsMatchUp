import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  register() {
    console.log(this.form.valid)
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();

      // Add a null check 
      if (name !== null && password !== null && email !== null) {
        this.authService.register(name, email, password).subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.status = 'failed';
          },
        });
      } else {
        // Handle the case where input is null (optional)
        console.error('Input is null');
        this.status = 'failed'; // or handle accordingly
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}