import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { WikiDataService } from '../../../../core/services/wiki-data.service';
import { GameClass } from '../../../../models/class.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, MatIconModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {
  selectedClass: string | null = null;
  classes: GameClass[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private wikiDataService: WikiDataService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    this.loading = true;
    this.error = null;
    
    // Récupérer l'ID de la classe depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.selectedClass = params['id'];
      }
    });
    
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
  }
  
  selectClass(classId: string) {
    this.selectedClass = classId;
  }
  
  getSelectedClass() {
    console.log('2Classe sélectionnée:', this.selectedClass, this.classes);
    return this.classes.find(c => c.id === this.selectedClass);
  }
  
  refreshClasses() {
    this.wikiDataService.clearClassesCache();
    this.ngOnInit();
  }
}
