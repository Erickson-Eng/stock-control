import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }


  canActivate():
   Observable<boolean | UrlTree>
   | Promise<boolean | UrlTree>
   | boolean
   | UrlTree {
    const isLoggedUser = this.userService.isLoggedIn();
    if(!isLoggedUser){
      this.router.navigate(['/home'])
      return false;
    }

    return true;
   }
}
