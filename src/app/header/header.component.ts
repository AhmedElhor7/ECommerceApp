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
    // subscribe to the user observable
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  
  ngOnChanges() {
    // check if the user is authenticated
    const user = localStorage.getItem('userData');
    if(user){
      this.isAuthenticated = true;
    }
  }

  // logout the user
  onLogout() {
    this.authService.logout();
  }

  // unsubscribe from the user observable
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
