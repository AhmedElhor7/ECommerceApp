import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AuthResponseData } from '../interface/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

 /**
  * @description load user data from local storage
  * @returns void
  * @param: none
  */
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('userData');
    if (!stored) return;

    try {
      const obj = JSON.parse(stored);
      const loaded = new User(obj.email, obj.name, obj.role, obj._token);
      this.user.next(loaded);
    } catch (error) {
      console.error('Failed to load user data from storage:', error);
      localStorage.removeItem('userData');
      this.user.next(null);
    }
  }

  public baseUrl: string = 'https://ecommerce.routemisr.com/api/v1';

  /**
  @param: email
  @param: password
  @return: Observable<AuthResponseData>
  @description: login to the application
  */
  login(email: string, password: string): Observable<AuthResponseData> {
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
          console.log(errorRes);
          if (errorRes.error.statusMsg === 'fail') {
            errorMessage = errorRes.error.message || errorMessage;
          }
          // return the error message
          return throwError(() => new Error(errorMessage));
        }),
        // if the login is successful
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.name,
            resData.role,
            resData.token
          );
        })
      );
  }

  /**
  @param: name
  @param: email
  @param: password
  @param: rePassword
  @param: phone
  @return: Observable<AuthResponseData>
  @description: register to the application
  */
  register(
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone: string
  ): Observable<AuthResponseData> {
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
          }
          // return the error message
          return throwError(() => new Error(errorMessage));
        }),
        // if the register is successful
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.name,
            resData.role,
            resData.token
          );
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
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth/login']);
  }

  get isLoggedIn(): boolean {
    const stored = localStorage.getItem('userData');
    if (!stored) return false;
    try {
      const data = JSON.parse(stored);
      return typeof data._token === 'string' && data._token.length > 0;
    } catch {
      return false;
    }
  }
}
