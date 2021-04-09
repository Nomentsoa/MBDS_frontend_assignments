import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  assignments: Assignment[];
 // uri = "http://localhost:8010/api/assignments"
 uri ="https://backendangularnode.herokuapp.com/api/assignments"

  constructor(private logginService: LoggingService, private http: HttpClient) { }

  getAssignments(): Observable<Assignment[]> {
    console.log("Dans le service de gestion des assignments...")
    // return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri);
  }


  getAssignmentsPagine(page:number, limit:number):Observable<any>{
    return this.http.get<Assignment[]>(this.uri+"?page="+page+"&limit="+limit);
  }

  generateId() {
    return Math.round(Math.random() * 100000);
  }
  addAssignment(assignment: Assignment): Observable<any> {
    assignment.id = this.generateId();
    /*this.assignments.push(assignment);*/
    this.logginService.log(assignment.nom, "a été ajouté.");
    // return of("Service: assignment ajouté !");
    return this.http.post(this.uri, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    // besoin de ne rien faire puisque l'assignment passé en paramètre
    // est déjà un élément du tableau

    //let index = this.assignments.indexOf(assignment);

    //console.log("updateAssignment l'assignment passé en param est à la position " + index + " du tableau");
    this.logginService.log(assignment.nom, "a été modifié.");
    // return of("Service: assignment modifié !");
    return this.http.put(this.uri, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {

    //let index = this.assignments.indexOf(assignment);

    // this.assignments.splice(index, 1);
    // return of("Service: assignment supprimé !");
    return this.http.delete(this.uri + "/" + assignment._id);
  }

  getAssignment(id: number): Observable<Assignment> {
    //return of(this.assignments.find(a => a.id === id));
    return this.http.get<Assignment>(this.uri + "/" + id)
      .pipe(
        map(a => {
          a.nom += " Modifie par MAP";
          return a;
        }),
        tap(a => {
          console.log("TRACE Dans tapa");
        }),
        /* filter( a => {
           return (a.rendu);
         })*/
        catchError(this.handleError<any>('getAssignments bu id avec id = ' + id))
      );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(operation + "a échoué " + error.message);

      return of(result as T);
    }
  }

  peuplerBDAvecForJoin(assignments: any): Observable<any> {
    const appelnouvelAssignment = [];

    for (let assignment of assignments) {
      console.log("Le nom est => " + assignment.nom);
      const nouvelAssignment = new Assignment();
      nouvelAssignment.id = assignment.id;
      nouvelAssignment.nom = assignment.nom;
      nouvelAssignment.dateDeRendu = assignment.dateDeRendu;
      nouvelAssignment.rendu = assignment.rendu;

      appelnouvelAssignment.push(this.addAssignment(nouvelAssignment))

    }
    return forkJoin(appelnouvelAssignment);
  }


}
