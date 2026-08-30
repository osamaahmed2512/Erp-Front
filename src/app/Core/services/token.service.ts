import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  setToken(token: string, refreshToken: string, expiresAt: string,
    expiresRefreshTokenAt: string,
    expiressessionExpiry:string ) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiresAt', expiresAt);

    localStorage.setItem(
      'expiresRefreshTokenAt',
      expiresRefreshTokenAt
    );
    localStorage.setItem('expiressessionExpiry',expiressessionExpiry);
  }
  getTokenExpiration() {
    return localStorage.getItem('expiresAt');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  getRefreshTokenExpiration() {
    return localStorage.getItem('expiresRefreshTokenAt');
  }
  getExpiresSessionExpiration() {
    return localStorage.getItem('expiressessionExpiry');
  }
  clear() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {

    return !this.issessionExpiryTimeExpired();
  }
  isRefreshTokenExpired(): boolean {

    const refreshExpire =
      this.getRefreshTokenExpiration();

    if (!refreshExpire) {
      return true;
    }

    return new Date(refreshExpire) < new Date();
  }
    issessionExpiryTimeExpired(): boolean {

    const sessionExpire =
      this.getExpiresSessionExpiration();

    if (!sessionExpire) {
      return true;
    }

    return new Date(sessionExpire) < new Date();
  }


    private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
    getRole(): string | null {
    return this.decodeToken()?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
  }
    isSuperAdmin(): boolean {
    return this.getRole() === 'SuperAdmin';
  }
    canSwitchCompany(): boolean {
    const role = this.getRole();
    return role === 'SuperAdmin' || role === 'Supervisor';
  }
}
