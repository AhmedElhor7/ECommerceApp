import { Injectable } from '@angular/core';
import {
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

/*
@param route: ActivatedRouteSnapshot
@param state: RouterStateSnapshot
@returns boolean
@description This guard is used to prevent unauthenticated users from accessing protected routes.
*/
  canActivate(): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map(user => !!user),
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}

