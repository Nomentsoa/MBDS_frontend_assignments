import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
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
  limit: number = 100;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;


  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;
  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
    console.log('AVANT AFFICHAGE');

    // on va voir s'il y a page et limit dans url
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 100;

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

  getPlusAssignmentsPourScrolling() {
    // on utilise le service pour récupérer les
    // assignments à afficher
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        this.assignments = this.assignments.concat(data.docs);// pour la concatenation
        //this.assignments = [...this.assignments, ...data.docs];
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


  ngAfterViewInit() {
    // appelé automatiquement apres l'affichage
    // donc l'élément scroller aura été affiché 

    // on va s'abonner aux évenement de scroll sur le scrolleing
    this.scroller.elementScrolled()
      .pipe(
        map(event => {
          return this.scroller.measureScrollOffset("bottom");
        }),
        pairwise(),
        /*
        tap(([y1, y2]) => {
          if(y2 < y1){
            console.log("on scrolle vers le bas");
          } else{
            console.log("on scolle vers le haut");
          }
        }),*/
        filter(([y1, y2]) =>
          (y2 < y1 && y2 < 200)
        ),
        throttleTime(200))
      .subscribe(dist => {
        this.ngZone.run(() => {
          console.log("Je charge plus d'assignments");
          if (this.hasNextPage) {
            this.page = this.nextPage;
            this.getPlusAssignmentsPourScrolling();
          }
        });
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
  premierePage() {
    /* this.page = 1;
     this.getAssignments();   */
    this.router.navigate(['/home'], {
      queryParams: {
        page: 1,
        limit: this.limit
      }
    })
  }

  pagePrecedente() {
    /*  this.page = this.prevPage;
      this.getAssignments();    */
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.prevPage,
        limit: this.limit
      }
    })
  }

  pageSuivante() {
    /*this.page = this.nextPage;    
    this.getAssignments();    */
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.nextPage,
        limit: this.limit
      }
    })
  }
  dernierePage() {
    /* this.page = this.totalPages;
    this.getAssignments();*/
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.totalPages,
        limit: this.limit
      }
    })
  }
}
