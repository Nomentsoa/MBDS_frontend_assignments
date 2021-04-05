import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {

  nom ="";
  dateDeRendu = null;
  assignment:Assignment;

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    // ici on montre comment on peut recupérer les parametres http
    //http://localhost:4200/assignment/2/edit?nom=Michel%20Buffa&metier=Professeur&Response=MIAGE#edition
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);
    this.getAssignmentById();
  }

  getAssignmentById(){
       // les params sont des string, on va forcer les conversion en number en mettant un + devant
    const id = +this.route.snapshot.params.id;
    console.log("Dans onInig id = " + id);
    this.assignmentsService.getAssignment(id)
      .subscribe(assignment => {
        this.assignment = assignment;

        this.nom = assignment.nom;
        this.dateDeRendu = assignment.dateDeRendu;
      });
  }
  
  onSubmit(event){
    // modification de l'assignment
    if ((!this.nom) || (!this.dateDeRendu)) return;
    this.assignment.nom = this.nom;
    this.assignment.dateDeRendu = this.dateDeRendu;

    this.assignmentsService.updateAssignment(this.assignment)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(["/home"]);
      });
  }
}
