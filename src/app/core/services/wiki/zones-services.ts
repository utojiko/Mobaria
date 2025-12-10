import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ZoneDetails } from '../../../models/zone.model';
import { AppStateService } from '../../services/app-state.service';
import { Monster } from '../../../models/monster.model';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  constructor(private http: HttpClient, private appState: AppStateService) { }

  getZones(): Observable<ZoneDetails[]> {
    return this.appState.zones$;
  }
  
  getZoneById(id: number): Observable<ZoneDetails | undefined> {
    return this.appState.zones$.pipe(
      map(zones => {
        const zone = zones.find(z => z.id === id);
        return zone;
      })
    );
  }
}
