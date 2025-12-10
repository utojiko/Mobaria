import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
import { Monster } from '../../../../../models/monster.model';

@Component({
    selector: 'app-monsters',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './monsters.component.html',
    styleUrl: './monsters.component.scss'
})
export class MonstersComponent implements OnInit {
    monsters: Monster[] = [];
    filteredMonsters: Monster[] = [];
    monsterZone: string[] = [];
    searchTerm: string = '';

    constructor(private wikiDataService: WikiDataService) { }

    ngOnInit() {
        this.wikiDataService.getMonsters().subscribe(monsters => {
            console.log('Monsters loaded:', monsters);
            this.monsters = monsters;
            this.filteredMonsters = monsters;
        });
    }

    filterMonsters() {
        this.filteredMonsters = this.monsters.filter(monster => {
            const matchesSearch = monster.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                monster.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesSearch;
        });
    }
}