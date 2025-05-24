import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Zone } from '../../../../../models/zone.model';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';

@Component({
  selector: 'app-zone-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './zone-detail.component.html',
  styleUrl: './zone-detail.component.scss'
})
export class ZoneDetailComponent implements OnInit {
  zone?: Zone;

  constructor(
    private route: ActivatedRoute,
    private wikiDataService: WikiDataService
  ) {}

  ngOnInit() {
    const zoneId = this.route.snapshot.paramMap.get('id');
    if (zoneId) {
      this.wikiDataService.getZoneById(zoneId).subscribe(zone => {
        this.zone = zone;
      });
    }
  }
}