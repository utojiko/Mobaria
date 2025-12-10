import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WikiDataService } from '../../../../../../core/services/wiki-data.service';
import { Monster } from '../../../../../../models/monster.model';

@Component({
    selector: 'app-monster-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './monster-details.component.html',
    styleUrl: './monster-details.component.scss'
})
export class MonsterDetailComponent implements OnInit {
    monster?: Monster;

    constructor(
        private route: ActivatedRoute,
        private wikiDataService: WikiDataService
    ) { }

    ngOnInit() {
        const monsterId = this.route.snapshot.paramMap.get('id');
        const monsterIdNum = Number(monsterId);
        console.log("ID du monstre :", monsterId);

        if (monsterId && !isNaN(monsterIdNum)) {
            // Utiliser directement le service AppStateService pour obtenir des données fiables
            // et attendre que les données soient chargées
            this.wikiDataService.getMonsters().subscribe(monsters => {
                if (monsters && monsters.length > 0) {
                    this.monster = monsters.find(m => m.id === monsterIdNum);
                    console.log('Monster loaded from all monsters:', this.monster);

                    if (!this.monster) {
                        // Si toujours pas trouvé, essayer la méthode par ID
                        this.wikiDataService.getMonsterById(monsterIdNum).subscribe(monster => {
                            console.log('Monster loaded by ID:', monster);
                            this.monster = monster;
                        });
                    }
                } else {
                    // Si la liste des monstres est vide, essayer directement par ID
                    this.wikiDataService.getMonsterById(monsterIdNum).subscribe(monster => {
                        console.log('Monster loaded by ID (fallback):', monster);
                        this.monster = monster;
                    });
                }
            });
        } else {
            console.warn('Paramètre monsterId invalide :', monsterId);
        }
    }
}