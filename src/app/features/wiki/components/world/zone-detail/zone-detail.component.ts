import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Zone, ZoneDetails } from '../../../../../models/zone.model';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
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
    if (zoneId) {
      this.wikiDataService.getZoneById(zoneId).subscribe(zone => {
        console.log("Zone chargée :", zone);
        this.zone = zone;
      });
    }
  }
}