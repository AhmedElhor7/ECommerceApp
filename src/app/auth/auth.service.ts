import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

// interface for the auth response data
export interface AuthResponseData {
  token: string;
  message: string;
  name: string;
  email: string;
  role: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router:Router) {}

  readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1';

  /*
  @parmeter: email
  @parmeter: password
  @return: Observable<AuthResponseData>
  @description: login to the application
  */
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.baseUrl}/auth/signin`,

        {
          email: email,
          password: password,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage: string = 'Unknown error occurred';
          // if password or email is incorrect
          if (errorRes.error.statusMsg === 'fail') {
            errorMessage = errorRes.error.message || errorMessage;
            // console.log('Error:', errorMessage);
          }
          // return the error message
          return throwError(() => new Error(errorMessage));
        }),
        // if the login is successful
        tap((resData) => {
          console.log(resData);
          this.handleAuthentication(
            resData.email,
            resData.name,
            resData.role,
            resData.token
          );
          console.log(this.user.getValue()?.token);
        })
      );
  }

  /*
  @parmeter: name
  @parmeter: email
  @parmeter: password
  @parmeter: rePassword
  @parmeter: phone
  @return: Observable<AuthResponseData>
  @description: register to the application
  */
  register(
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone: string
  ) {
    return this.http
      .post<AuthResponseData>(
        `${this.baseUrl}/auth/signup`,

        {
          name: name,
          email: email,
          password: password,
          rePassword: rePassword,
          phone: phone,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage: string = 'Unknown error occurred';
          // if password or email or phone is incorrect
          if (errorRes.error.statusMsg === 'fail') {
            errorMessage = errorRes.error.message || errorMessage;
            // console.log('Error:', errorMessage);
          }
          // return the error message
          return throwError(() => new Error(errorMessage));
        }),
        // if the register is successful
        tap((resData) => {
          console.log(resData);
          this.handleAuthentication(
            resData.email,
            resData.name,
            resData.role,
            resData.token
          );
          console.log(this.user.getValue()?.token);
        })
      );
  }

  private handleAuthentication(
    email: string,
    name: string,
    role: string,
    token: string
  ) {
    const user = new User(email, name, role, token);
    this.user.next(user);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth/login']);
  }
}
