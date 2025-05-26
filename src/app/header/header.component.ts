import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.setupUserSubscription();
  }

  /**
   * @description
   * - Subscribes to the authService.user observable
   * - Updates isAuthenticated flag based on user state
   * - Handles clean up in ngOnDestroy
   * @returns:void
   */
  private setupUserSubscription(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  // logout the user
  onLogout() {
    this.authService.logout();
  }

  // unsubscribe from the user observable
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
