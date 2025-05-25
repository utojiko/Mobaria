import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Quest } from '../../models/quest.model';
import { Monster } from '../../models/monster.model';
import { GameClass } from '../../models/class.model';
import { Zone, ZoneDetails, Dungeon, Mob } from '../../models/zone.model';

// This service would typically fetch data from an API
// For demonstration, we're using hardcoded data

@Injectable({
  providedIn: 'root'
})
export class WikiDataService {
  private readonly CLASSES_STORAGE_KEY = 'mobaria_classes';
  private readonly ZONES_STORAGE_KEY = 'mobaria_zones';
  private readonly CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';
  private readonly ZONES_TIMESTAMP_KEY = 'mobaria_zone_timestamp';

  // Cache validity duration in milliseconds (e.g., 24 hours)
  private readonly CACHE_VALIDITY_DURATION = 24 * 60 * 60 * 1000;

  constructor(private http: HttpClient) { }

  // Placeholder methods to simulate API calls
  // In a real implementation, these would fetch data from a backend

  getQuests(): Observable<Quest[]> {
    return of([]); // Replace with mock data or actual API calls
  }

  getQuestById(id: string): Observable<Quest | undefined> {
    return of(undefined); // Replace with mock data or actual API calls
  }

  getMonsters(): Observable<Monster[]> {
    return of([]); // Replace with mock data or actual API calls
  }

  getMonsterById(id: string): Observable<Monster | undefined> {
    return of(undefined); // Replace with mock data or actual API calls
  }

  /**
   * Check if the cache is still valid based on the timestamp
   * @returns boolean indicating if the cache is still valid
   */
  private isCacheValid(): boolean {
    const timestampStr = localStorage.getItem(this.CLASSES_TIMESTAMP_KEY);
    if (!timestampStr) return false;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    return now - timestamp < this.CACHE_VALIDITY_DURATION;
  }

  /**
   * Clears the classes cache to force a fresh load from the server
   */
  clearClassesCache(): void {
    localStorage.removeItem(this.CLASSES_STORAGE_KEY);
    localStorage.removeItem(this.CLASSES_TIMESTAMP_KEY);
    console.log('Cache des classes effacé');
  }

  /**
   * Gets all game classes, either from localStorage if valid or from the JSON file
   */
  getClasses(): Observable<GameClass[]> {
    // Check if classes data exists in localStorage and is still valid
    const cachedClasses = localStorage.getItem(this.CLASSES_STORAGE_KEY);

    if (cachedClasses && this.isCacheValid()) {
      console.log('Classes chargées depuis le localStorage');
      return of(JSON.parse(cachedClasses));
    }

    // If not in localStorage or cache expired, fetch from JSON file and store in localStorage
    return this.http.get<GameClass[]>('assets/data/class-details.json').pipe(
      tap(classes => {
        console.log('Classes chargées depuis le fichier JSON et stockées dans localStorage');
        localStorage.setItem(this.CLASSES_STORAGE_KEY, JSON.stringify(classes));
        localStorage.setItem(this.CLASSES_TIMESTAMP_KEY, Date.now().toString());
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des classes:', error);

        // If there's cached data even if expired, return it as fallback
        if (cachedClasses) {
          console.log('Utilisation des données en cache comme solution de secours');
          return of(JSON.parse(cachedClasses));
        }

        return of([]);
      })
    );
  }

  /**
   * Gets a specific game class by ID, either from localStorage if valid or from the JSON file
   */
  getClassById(id: string): Observable<GameClass | undefined> {
    const cachedClasses = localStorage.getItem(this.CLASSES_STORAGE_KEY);

    if (cachedClasses && this.isCacheValid()) {
      console.log(`Recherche de la classe avec l'ID ${id} dans le localStorage`);
      const classes = JSON.parse(cachedClasses) as GameClass[];
      return of(classes.find(c => c.id == id));
    }

    // If not in localStorage or cache expired, fetch all classes and then find the one by id
    return this.getClasses().pipe(
      map(classes => {
        console.log(`Recherche de la classe avec l'ID ${id} après chargement du JSON`);
        return classes.find(c => c.id == id);
      }),
      catchError(error => {
        console.error(`Erreur lors du chargement de la classe avec l'ID ${id}:`, error);

        // If there's cached data even if expired, try to use it as fallback
        if (cachedClasses) {
          console.log('Tentative d\'utilisation des données en cache comme solution de secours');
          const classes = JSON.parse(cachedClasses) as GameClass[];
          return of(classes.find(c => c.id == id));
        }

        return of(undefined);
      })
    );
  }

  getZones(): Observable<ZoneDetails[]> {
    const cachedZones = localStorage.getItem(this.ZONES_STORAGE_KEY);

    if (cachedZones && this.isCacheValid()) {
      console.log('Zones chargées depuis le localStorage');
      const zones = JSON.parse(cachedZones) as ZoneDetails[];
      return of(zones);
    }

    return this.http.get<ZoneDetails[]>('assets/data/zones.json').pipe(
      tap(zones => {
        console.log('Zones chargées depuis le fichier JSON et stockées dans localStorage');
        localStorage.setItem(this.ZONES_STORAGE_KEY, JSON.stringify(zones));
        localStorage.setItem(this.ZONES_TIMESTAMP_KEY, Date.now().toString());
      }),
      map(zones => this.populateZonesWithDetails(zones))
    );
  }

  private populateZonesWithDetails(zones: ZoneDetails[]): ZoneDetails[] {
    const mobs$ = this.http.get<Mob[]>('assets/data/mobs.json');
    const dungeons$ = this.http.get<Dungeon[]>('assets/data/dungeon.json');

    mobs$.subscribe(mobs => {
      dungeons$.subscribe(dungeons => {
        zones.forEach(zone => {
          console.log(`Traitement de la zone: ${zone.name}`);
          console.log(zone.mobs_outside);

          // Remplacement des IDs de mobs par leurs objets correspondants
          zone.mobs_outside = zone.mobs_outside
            .map(id => mobs.find(mob => mob.id === Number(id)))
            .filter((mob): mob is Mob => mob !== undefined);
          console.log(zone.mobs_outside);

          // Remplacement des IDs de donjons par leurs objets correspondants
          zone.dungeons = zone.dungeons
            ?.map(id => {
              const dungeon = dungeons.find(d => d.id === Number(id));
              if (dungeon) {
                dungeon.mobs = dungeon.mobs
                  ?.map(mobId => mobs.find(mob => mob.id === Number(mobId)))
                  .filter((mob): mob is Mob => mob !== undefined) || [];
              }
              return dungeon;
            })
            .filter((dungeon): dungeon is Dungeon => dungeon !== undefined) || [];

          localStorage.setItem(this.ZONES_STORAGE_KEY, JSON.stringify(zones));

        });
      });
    });

    console.log("ZONE FINALE", zones);
    return zones;
  }

  getZoneById(id: string): Observable<ZoneDetails | undefined> {
    const numId = parseInt(id, 10);
    const cachedZones = localStorage.getItem(this.ZONES_STORAGE_KEY);

    if (cachedZones && this.isCacheValid()) {
      console.log(`Recherche de la classe avec l'ID ${numId} dans le localStorage`);
      const zones = JSON.parse(cachedZones) as ZoneDetails[];
      console.log(`Zones trouvées: ${zones.length} ${numId}`);
      console.log(zones, of(zones.find(c => c.id == numId)));
      return of(zones.find(c => c.id == numId));
    }

    // If not in localStorage or cache expired, fetch all zones and then find the one by id
    return this.getZones().pipe(
      map(zones => {
        console.log(`Recherche de la classe avec l'ID ${numId} après chargement du JSON`);
        return zones.find(c => c.id == numId);
      }),
      catchError(error => {
        console.error(`Erreur lors du chargement de la classe avec l'ID ${numId}:`, error);

        // If there's cached data even if expired, try to use it as fallback
        if (cachedZones) {
          console.log('Tentative d\'utilisation des données en cache comme solution de secours');
          const zones = JSON.parse(cachedZones) as ZoneDetails[];
          return of(zones.find(c => c.id == numId));
        }

        return of(undefined);
      })
    );
  }

  getDungeonsByIds(ids: number[]): Observable<Dungeon[]> {
    return this.http.get<Dungeon[]>('assets/data/dungeon.json').pipe(
      map(dungeons => dungeons.filter(dungeon => ids.includes(dungeon.id)))
    );
  }

  getMobsByIds(ids: number[]): Observable<Mob[]> {
    return this.http.get<Mob[]>('assets/data/mobs.json').pipe(
      map(mobs => mobs.filter(mob => ids.includes(mob.id)))
    );
  }
}