import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WikiDataService } from '../../../../core/services/wiki-data.service';
import { Monster } from '../../../../models/monster.model';

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
    monsterFamilies: string[] = [];
    selectedFamily: string = '';
    searchTerm: string = '';

    constructor(private wikiDataService: WikiDataService) { }

    ngOnInit() {
        this.wikiDataService.getMonsters().subscribe(monsters => {
            this.monsters = monsters;
            this.filteredMonsters = monsters;
            this.monsterFamilies = [...new Set(monsters.map(m => m.family))];
        });
    }

    filterMonsters() {
        this.filteredMonsters = this.monsters.filter(monster => {
            const matchesSearch = monster.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                monster.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesFamily = !this.selectedFamily || monster.family === this.selectedFamily;
            return matchesSearch && matchesFamily;
        });
    }

    filterByFamily(family: string) {
        this.selectedFamily = this.selectedFamily === family ? '' : family;
        this.filterMonsters();
    }
}