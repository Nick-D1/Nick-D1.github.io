import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
})

//Added error tracking and feedback variables
export class LoginComponent {
  public formError: string = '';
  // prevents duplicate logins and adds UX clarity
  public isLoading: boolean = false; 
  public credentials = {
    email: '',
    //Removed "name" field; authentication should rely only on email + password
    password: '', 
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  //Hardened login handler
   public async onLoginSubmit(): Promise<void> {
    // Reset errors each submission
    this.formError = '';

    // Basic field presence validation
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return; // stop execution early
    }

    // Minimal client-side validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.credentials.email)) {
      this.formError = 'Please enter a valid email address.';
      return;
    }

    if (this.credentials.password.length < 8) {
      // Encourage stronger passwords even at login 
      this.formError = 'Password must be at least 8 characters long.';
      return;
    }

    // loading flag to block repeated submissions
    this.isLoading = true;

    try {
  
      // Ensures we know whether login succeeded or failed
      const success = await this.authenticationService.login(
        { email: this.credentials.email, name: '' },
        this.credentials.password
      );

      if (success) {
        // Redirect safely after successful authentication
        this.router.navigate(['/dashboard']);
      } else {
        // Generic error message prevents account enumeration
        this.formError = 'Invalid email or password.';
      }
    } catch (err) {
      // Catch unexpected errors (network, 500, etc.)
      console.error('Login error:', err);
      this.formError = 'Login failed. Please try again later.';
    } finally {
      // Reset loading indicator whether login succeeded or failed
      this.isLoading = false;
    }
  }
}
