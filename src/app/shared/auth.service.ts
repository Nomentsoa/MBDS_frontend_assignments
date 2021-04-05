import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn:boolean = false;
  admin = false;


  constructor() { }

  logIn(login, password){
    // 
    if(login === "admin") this.admin = true
    this.loggedIn = true;
  }

  logOut(){
    this.loggedIn = false;    
    this.admin = false;
  }
  
  isAdmin(){
   return new Promise((resolve, reject) => {
     resolve(this.admin);
   });

   
  }
}
