import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  // ajoutActive = false;
  assignmentSelectionne: Assignment;
  formVisible = false;

  assignments: Assignment[];
  page: number = 1;
  totalDocs: number;
  limit: number = 10;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    console.log('AVANT AFFICHAGE');

    // on va voir s'il y a page et limit dans url
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;
  
      this.getAssignments();
    });
    
    console.log("getAssignments() du service appelé");
  }


  getAssignments() {
    // on utilise le service pour récupérer les
    // assignments à afficher
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        this.assignments = data.docs;
        this.page = data.page;
        this.totalDocs = data.totalDocs;
        this.limit = data.limit;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues prev => " + this.hasPrevPage + " next " + this.hasNextPage);
      });
  }
  assignmentClique(a) {
    this.assignmentSelectionne = a;
  }



  onDeleteAssignment(event) {
    // event = l'assignment à supprimer
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
        console.log(message);
      })
  }
  premierePage(){
   /* this.page = 1;
    this.getAssignments();   */
    this.router.navigate(['/home'],{
      queryParams:{
        page: 1,
        limit: this.limit
      }
    })
  }

  pagePrecedente() {   
  /*  this.page = this.prevPage;
    this.getAssignments();    */
    this.router.navigate(['/home'],{
      queryParams:{
        page: this.prevPage,
        limit: this.limit
      }
    })
  }

  pageSuivante() {   
    /*this.page = this.nextPage;    
    this.getAssignments();    */
    this.router.navigate(['/home'],{
      queryParams:{
        page: this.nextPage,
        limit: this.limit
      }
    })
  }
  dernierePage(){
    /* this.page = this.totalPages;
    this.getAssignments();*/ 
    this.router.navigate(['/home'],{
      queryParams:{
        page: this.totalPages,
        limit: this.limit
      }
    })
  }
}
