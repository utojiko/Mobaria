import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
import { Dungeon } from '../../../../../models/dungeon.model';

@Component({
    selector: 'app-dungeons',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dungeons.component.html',
    styleUrl: './dungeons.component.scss'
})
export class DungeonsComponent implements OnInit {
    dungeons: Dungeon[] = [];
    filteredDungeons: Dungeon[] = [];
    dungeonZone: string[] = [];
    searchTerm: string = '';

    constructor(private wikiDataService: WikiDataService) { }

    ngOnInit() {
        this.wikiDataService.getDungeons().subscribe(dungeons => {
            console.log('dungeons loaded:', dungeons);
            this.dungeons = dungeons;
            this.filteredDungeons = dungeons;
        });
    }

    filterDungeons() {
        this.filteredDungeons = this.dungeons.filter(Dungeon => {
            const matchesSearch = Dungeon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                Dungeon.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesSearch;
        });
    }
}