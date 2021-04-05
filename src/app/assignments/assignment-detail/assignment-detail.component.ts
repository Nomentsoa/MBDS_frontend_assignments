import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  // passé sous forme d'attribut HTML
  @Input() assignmentTransmis: Assignment;
 
  constructor(private assignmentsService: AssignmentsService,
              private route: ActivatedRoute, 
              private router: Router, 
              private authService:AuthService) { }

  ngOnInit(): void {
    this.getAssignmentById();
  }

  getAssignmentById(){
       // les params sont des string, on va forcer les conversion en number en mettant un + devant
    const id = +this.route.snapshot.params.id;
    console.log("Dans onInig id = " + id);
    this.assignmentsService.getAssignment(id)
      .subscribe(assignment => {
        this.assignmentTransmis = assignment;
      });
  }

  onAssignmentRendu() {
    this.assignmentTransmis.rendu = true;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(["/home"]);
      })

    //this.assignmentTransmis = null;
  }

  onDelete() {
    // on emet vers le père
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
      .subscribe(response => {
        console.log(response.message);

        // on cache l'affichage du détail
        this.assignmentTransmis = null;

        this.router.navigate(['/home']);
      })


  }

  onClickEdit(){
    this.router.navigate(["/assignment", this.assignmentTransmis.id, "edit"],{
      queryParams:{
        nom:"Michel Buffa",
        metier:"Professeur",
        Response:"MIAGE"
      },
      fragment:"edition"
    })
  }

  isAdmin(){
      return this.authService.admin;
  }
}
