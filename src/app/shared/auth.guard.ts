import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //return true;


    // on n'autorisera l'activation de la router assiciée que si on est bien un admin
    return this.authService.isAdmin()
    .then(admin => {
      if(admin){
        console.log("GUARD : vous êtes admin, autorisé");
        return true;
      }else{
        //on renvoie vers la page d'accueil
        console.log("GUARD: vous n'êtes pas autorisé a EDit car vous n'êtes pas admin");
        this.router.navigate(["/home"]);
        return false;
      }
    })
  }
  
}
