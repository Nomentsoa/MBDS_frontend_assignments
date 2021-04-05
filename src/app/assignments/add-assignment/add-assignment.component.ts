import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {

  nom = '';
  dateDeRendu = null;

  constructor(private assignmentService:AssignmentsService, private router:Router) {}

  ngOnInit(): void {}

  onSubmit(event) {   

    console.log("Dans onSubmit() !");
    if((!this.nom) || (!this.dateDeRendu)) return;

    let nouvelAssignment = new Assignment();
    nouvelAssignment.nom = this.nom;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;

    this.assignmentService.addAssignment(nouvelAssignment)
      .subscribe(response => {
        console.log(response.message);
        this.router.navigate(["/home"]);
      })
  
  }

}
