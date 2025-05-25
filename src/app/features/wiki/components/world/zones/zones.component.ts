import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WikiDataService } from '../../../../../core/services/wiki-data.service';
import { Zone, ZoneDetails } from '../../../../../models/zone.model';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss'
})
export class ZonesComponent implements OnInit {
  zones: ZoneDetails[] = [];

  constructor(private wikiDataService: WikiDataService, private http: HttpClient) {}

  ngOnInit() {
    this.wikiDataService.getZones().subscribe(zones => {
      this.zones = zones;
    });

    this.http.get<any[]>('assets/data/zones.json').subscribe(data => {
      this.zones = data;
    });
  }
}