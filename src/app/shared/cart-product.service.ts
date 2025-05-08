import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CartProductAuthService {
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(private http: HttpClient, private router: Router) {}

  /*
  @description: Show the alert
  @param: message - string
  @param: type - 'success' | 'danger'
  @returns: void
  */
  public showAlert(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => (this.alertMessage = ''), 3000);
  }

  /*
    @description: Handle the error
    @param: error - any
    @param: fallback - string
    @returns: Observable<never>
    */
  public handleError(error: any, fallback: string): Observable<never> {
    console.error(error);
    this.showAlert(error.message || fallback, 'danger');
    return throwError(() => error);
  }

  /*
  @description: Get the auth headers
  @returns: HttpHeaders | null
  */
  public getAuthHeaders(): HttpHeaders | null {
    const user = JSON.parse(localStorage.getItem('userData') || 'null');
    const token = user?._token;
    return token ? new HttpHeaders({ token }) : null;
  }
}
