import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
import { Zone } from '../../../../../models/zone.model';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss'
})
export class ZonesComponent implements OnInit {
  zones: Zone[] = [];

  constructor(private wikiDataService: WikiDataService) {}

  ngOnInit() {
    this.wikiDataService.getZones().subscribe(zones => {
      this.zones = zones;
    });
  }
}