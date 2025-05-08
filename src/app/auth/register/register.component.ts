import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthResponseData, AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AlertComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [AuthService],
})
export class RegisterComponent {
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isLoggedIn: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    // if the form is valid
    if (form.valid) {
      const name: string = form.value.name;
      const email: string = form.value.email;
      const password: string = form.value.password;
      const rePassword: string = form.value.rePassword;
      const phone: string = form.value.phone;
      let authObservable: Observable<AuthResponseData>;

      // call the register method
      authObservable = this.authService.register(name, email, password, rePassword, phone);

      // subscribe to the observable
      authObservable.subscribe({
        next: (responseData) => {
          this.isLoading = false;
          this.errorMessage = null;
          this.router.navigate(['/auth/login']);
          form.reset();
        },
        // if there is an error
        error: (errorMessage) => {
          this.isLoading = false;
          this.errorMessage = errorMessage;
        },
      });
      // if the form is invalid
    } else {
      this.errorMessage = 'Invalid form data';
    }
  }
}
