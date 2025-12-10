import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Zone, ZoneDetails } from '../../../../../../models/zone.model';
import { WikiDataService } from '../../../../../../core/services/wiki-data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-zone-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './zone-detail.component.html',
  styleUrl: './zone-detail.component.scss'
})
export class ZoneDetailComponent implements OnInit {
  zone?: ZoneDetails;

  constructor(
    private route: ActivatedRoute,
    private wikiDataService: WikiDataService
  ) {}

  ngOnInit() {
    const zoneId = this.route.snapshot.paramMap.get('id');
    const zoneIdNum = Number(zoneId);
    if (zoneId && !isNaN(zoneIdNum)) {
      this.wikiDataService.getZoneById(zoneIdNum).subscribe(zone => {
        this.zone = zone;
        console.log('Zone details loaded:', this.zone);
      });
    } else {
      console.warn('Paramètre zoneId invalide :', zoneId);
    }
  }
}