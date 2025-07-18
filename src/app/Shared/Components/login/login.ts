import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../Core/services/modal.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, CommonModule, FormsModule,
    ReactiveFormsModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  returnUrl: string = '/dashboard';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.modalService.ShowSuccess("Bienvenido!")
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Error en el login. Verifica tus credenciales.';

          if (error.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          } else {
            errorMessage = error.error.message;
          }
          this.modalService.ShowError(errorMessage)
          this.cdr.detectChanges();
        }
      });
    } else {
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }

    if (control?.hasError('email')) {
      return 'Ingresa un email válido';
    }

    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }
}
