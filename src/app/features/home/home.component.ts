import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WikiDataService } from '../../core/services/wiki-data.service';
import { GameClass } from '../../models/class.model';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  sections = [
    { id: 'hero', visible: true },
    { id: 'features', visible: false },
    { id: 'world', visible: false },
    { id: 'serveur_info', visible: false },
    { id: 'classes', visible: false },
    { id: 'join', visible: false }
  ];
  
  gameClasses: GameClass[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  constructor(private wikiDataService: WikiDataService) {}
  
  ngOnInit() {
    this.loadClasses();
  }
  
  loadClasses() {
    this.loading = true;
    this.error = null;
    
    this.wikiDataService.getClasses().subscribe({
      next: classes => {
        this.gameClasses = classes;
        this.loading = false;
        console.log('Classes chargées avec succès:', classes);
      },
      error: err => {
        this.error = 'Erreur lors du chargement des classes';
        this.loading = false;
        console.error('Erreur lors du chargement des classes:', err);
      }
    });
  }
  
  refreshClasses() {
    this.wikiDataService.clearClassesCache();
    this.loadClasses();
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    
    this.sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const position = element.offsetTop - window.innerHeight / 2;
        section.visible = scrollPosition > position;
      }
    });
  }
}