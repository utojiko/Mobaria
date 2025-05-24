import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
import { Monster } from '../../../../../models/monster.model';

@Component({
    selector: 'app-monster-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './monster-detail.component.html',
    styleUrl: './monster-detail.component.scss'
})
export class MonsterDetailComponent implements OnInit {
    monster?: Monster;

    constructor(
        private route: ActivatedRoute,
        private wikiDataService: WikiDataService
    ) { }

    ngOnInit() {
        const monsterId = this.route.snapshot.paramMap.get('id');
        if (monsterId) {
            this.wikiDataService.getMonsterById(monsterId).subscribe(monster => {
                this.monster = monster;
            });
        }
    }
}