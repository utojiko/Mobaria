import { Component } from '@angular/core';
import { WikiDataService } from '../../../../core/services/wiki-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wiki-refresh-cache',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <button mat-stroked-button color="primary" (click)="refreshCache()">
      <mat-icon>refresh</mat-icon>
      Actualiser les données
    </button>
  `,
  styles: [`
    button {
      margin: 16px 0;
      font-size: 0.9rem;
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class WikiRefreshCacheComponent {
  constructor(
    private wikiDataService: WikiDataService,
    private snackBar: MatSnackBar
  ) {}

  refreshCache(): void {
    this.wikiDataService.clearClassesCache();
    
    // Recharger les données immédiatement
    this.wikiDataService.getClasses().subscribe({
      next: () => {
        this.snackBar.open('Données du wiki actualisées avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'actualisation des données:', err);
        this.snackBar.open('Erreur lors de l\'actualisation des données', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
