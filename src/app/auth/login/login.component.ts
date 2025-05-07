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
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService],
})
export class LoginComponent {
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    console.log(form);
    // if the form is valid
    if (form.valid) {
      const email: string = form.value.email;
      const password: string = form.value.password;
      let authObservable: Observable<AuthResponseData>;
      console.log(email, password);

      // call the login method
      authObservable = this.authService.login(email, password);

      // subscribe to the observable
      authObservable.subscribe({
        next: (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          console.log('se eeeeeeeeeeeeeeeeeee' + this.errorMessage);

          this.errorMessage = null;
          this.router.navigate(['/products']);
          form.reset();
        },
        // if there is an error
        error: (errorMessage) => {
          console.log('erorororoororororo' + errorMessage);
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
