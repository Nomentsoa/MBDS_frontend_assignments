import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import allData from './data.json';
import { Assignment } from './assignments/assignment.model';
import { AssignmentsService } from './shared/assignments.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  assignments: any  = allData;
  title = 'assignment-app';
  constructor (private auttService:AuthService, private router:Router, private assignmentsService:AssignmentsService){
  }

  login(){
    // si je suis loggé, je me loggue, sinon je me déloggue et j'affiche la page d'accueil

    if(this.auttService.loggedIn){
      this.auttService.logOut();
      // on navigue vers la page d'accueil
      this.router.navigate(["/home"]);
    }else{
      this.auttService.logIn("admin","toto");
    }
  }

  loadDataToMongoDb(){
   /* for(let assignment of this.assignments){
      console.log("Le nom est => "+assignment.nom);
      let nouvelAssignment = new Assignment();
      nouvelAssignment.id = assignment.id;
      nouvelAssignment.nom = assignment.nom;
      nouvelAssignment.dateDeRendu = assignment.dateDeRendu;
      nouvelAssignment.rendu = assignment.rendu;
     
      this.assignmentsService.addAssignment(nouvelAssignment)
        .subscribe(response => {
          console.log(response.message);
        });

    }*/

    this.assignmentsService.peuplerBDAvecForJoin(this.assignments)
      .subscribe(() => {
        console.log("La base de donnée a étée peuplé");
        this.router.navigate(["/home"],{replaceUrl:true});
      })
  
  }
}
