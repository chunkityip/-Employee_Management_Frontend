import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './service.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // First check localStorage for immediate auth status
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AuthGuard: Checking authentication');
    console.log('AuthGuard: localStorage auth status:', isAuthenticated);
    
    if (isAuthenticated) {
      // User is authenticated based on localStorage
      return true;
    }
    
    // If not in localStorage, check the observable
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        console.log('AuthGuard: Observable auth status:', isLoggedIn);
        
        if (!isLoggedIn) {
          console.log('AuthGuard: User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}