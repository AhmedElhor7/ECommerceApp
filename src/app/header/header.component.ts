import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {  HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [AuthService],
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  isAuthenticated: boolean = false;
  private userSub!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = localStorage.getItem('userData');
    if(user){
      this.isAuthenticated = true;
    }
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnChanges() {
    const user = localStorage.getItem('userData');
    if(user){
      this.isAuthenticated = true;
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
