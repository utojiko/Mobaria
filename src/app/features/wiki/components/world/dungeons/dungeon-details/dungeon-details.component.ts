import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WikiDataService } from '../../../../../../core/services/wiki-data.service';
import { Dungeon } from '../../../../../../models/dungeon.model';

@Component({
    selector: 'app-dungeon-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dungeon-details.component.html',
    styleUrl: './dungeon-details.component.scss'
})
export class DungeonDetailComponent implements OnInit {
    dungeon?: Dungeon;

    constructor(
        private route: ActivatedRoute,
        private wikiDataService: WikiDataService
    ) { }

    ngOnInit() {
        const dungeonId = this.route.snapshot.paramMap.get('id');
        const dungeonIdNum = Number(dungeonId);
        console.log("ID du donjon :", dungeonId);

        if (dungeonId && !isNaN(dungeonIdNum)) {
            // Utiliser directement le service AppStateService pour obtenir des données fiables
            // et attendre que les données soient chargées
            this.wikiDataService.getDungeons().subscribe(dungeons => {
                if (dungeons && dungeons.length > 0) {
                    this.dungeon = dungeons.find(m => m.id === dungeonIdNum);
                    console.log('Dungeon loaded from all dungeons:', this.dungeon);

                    if (!this.dungeon) {
                        // Si toujours pas trouvé, essayer la méthode par ID
                        this.wikiDataService.getDungeonById(dungeonIdNum).subscribe(dungeon => {
                            console.log('Dungeon loaded by ID:', dungeon);
                            this.dungeon = dungeon;
                        });
                    }
                } else {
                    // Si la liste des donjons est vide, essayer directement par ID
                    this.wikiDataService.getDungeonById(dungeonIdNum).subscribe(dungeon => {
                        console.log('Dungeon loaded by ID (fallback):', dungeon);
                        this.dungeon = dungeon;
                    });
                }
            });
        } else {
            console.warn('Paramètre dungeonId invalide :', dungeonId);
        }
    }
}