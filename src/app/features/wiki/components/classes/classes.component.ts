import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { WikiDataService } from '../../../../core/services/wiki-data.service';
import { GameClass } from '../../../../models/class.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [NgClass, NgIf, MatIconModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {
  selectedClassId: number | null = null;
  selectedClass: GameClass | null = null;
  classes: GameClass[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private wikiDataService: WikiDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loading = true;
    this.error = null;
    
    this.wikiDataService.getClasses().subscribe({
      next: data => {
        this.classes = data;
        this.loading = false;
        
        console.log('Classes chargées avec succès:', data);
      },
      error: err => {
        this.error = 'Erreur lors du chargement des classes. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors du chargement des classes:', err);
      }
    });

    
    // Récupérer l'ID de la classe depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.selectClass(params['id']);
        console.log('ID de la classe sélectionnée:', this.selectedClassId);
      }
    });
  }
  
  selectClass(classId: number) {
    this.selectedClassId = classId;
    this.selectedClass = this.classes.find(c => c.id === classId) || null;
    
    // Mettre à jour l'URL avec l'ID de la classe sélectionnée
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: classId },
      queryParamsHandling: 'merge' // Conserver les autres paramètres d'URL s'il y en a
    });
  }
  
  getSelectedClass() {
    return this.classes.find(c => c.id === this.selectedClassId);
  }
  
  refreshClasses() {
    this.wikiDataService.clearClassesCache();
    this.ngOnInit();
  }
}
