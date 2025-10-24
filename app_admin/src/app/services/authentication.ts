import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  public getToken(): string {
    const token = this.storage.getItem('travlr-token');
    return token ?? '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    }
    return false;
  }

  public getCurrentUser(): User {
    const token = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  /**
   * Hardened login method.
   * Returns a Promise<boolean> so the component can `await` it.
   */
  public async login(user: User, passwd: string): Promise<boolean> {
    try {
      // Convert Observable to Promise using firstValueFrom
      const value = await firstValueFrom(this.tripDataService.login(user, passwd));

      if (value) {
        this.authResp = value;
        this.saveToken(this.authResp.token);
        return true; // login successful
      } else {
        return false; // login failed (empty response)
      }
    } catch (error) {
      console.error('Login error:', error);
      return false; // network or server error
    }
  }

  /**
   * Hardened register method (optional).
   */
  public async register(user: User, passwd: string): Promise<boolean> {
    try {
      const value = await firstValueFrom(this.tripDataService.register(user, passwd));

      if (value) {
        this.authResp = value;
        this.saveToken(this.authResp.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }
}
