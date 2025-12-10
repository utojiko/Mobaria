import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Monster } from '../../models/monster.model';
import { GameClass } from '../../models/class.model';
import { ZoneDetails } from '../../models/zone.model';
import { Item } from '../../models/item.model';
import { Dungeon } from '../../models/dungeon.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly CACHE_VALIDITY_DURATION = 24 * 60 * 60 * 1000; // 24 heures

  // BehaviorSubjects pour stocker les données
  private monsters = new BehaviorSubject<Monster[]>([]);
  private classes = new BehaviorSubject<GameClass[]>([]);
  private zones = new BehaviorSubject<ZoneDetails[]>([]);
  private recipes = new BehaviorSubject<any[]>([]);
  private items = new BehaviorSubject<Item[]>([]);
  private dungeons = new BehaviorSubject<Dungeon[]>([]);
  private zonesEnriched = new BehaviorSubject<boolean>(false);

  // Observables publics
  public monsters$ = this.monsters.asObservable();
  public classes$ = this.classes.asObservable();
  public zones$ = this.zones.asObservable();
  public recipes$ = this.recipes.asObservable();
  public items$ = this.items.asObservable();
  public dungeons$ = this.dungeons.asObservable();
  public zonesEnriched$ = this.zonesEnriched.asObservable();

  // État de chargement
  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Initialise les données de l'application
   */
  public initializeAppData(forceRefresh: boolean = false): void {
    this.loading.next(true);

    console.log("app-state initializeAppData")
    // Vérification automatique de la fraîcheur des caches
    if (!forceRefresh) {
      const timestamps = [
        'mobaria_mobs_timestamp',
        'mobaria_classes_timestamp',
        'mobaria_zone_timestamp',
        'mobaria_recipes_timestamp',
        'mobaria_items_timestamp',
        'mobaria_dungeons_timestamp'
      ];
      const now = Date.now();
      let hasAnyTimestamp = false;
      let isAnyCacheStale = false;
      timestamps.forEach(key => {
        const ts = localStorage.getItem(key);
        if (ts) {
          hasAnyTimestamp = true;
          if (now - parseInt(ts, 10) > this.CACHE_VALIDITY_DURATION) {
            isAnyCacheStale = true;
          }
        }
      });
      if (hasAnyTimestamp && isAnyCacheStale) {
        console.log('Un ou plusieurs caches sont trop vieux, rafraîchissement complet...');
        this.refreshAllData();
        return;
      }
    }

    const dataToLoad = [
      {
        url: 'assets/data/mobs.json', storageKey: 'mobaria_mobs', timestampKey: 'mobaria_mobs_timestamp',
        stateUpdater: (data: any) => this.monsters.next(data)
      },
      {
        url: 'assets/data/class-details.json', storageKey: 'mobaria_classes', timestampKey: 'mobaria_classes_timestamp',
        stateUpdater: (data: any) => this.classes.next(data)
      },
      {
        url: 'assets/data/zones.json', storageKey: 'mobaria_zones', timestampKey: 'mobaria_zone_timestamp',
        stateUpdater: (data: any) => this.zones.next(data)
      },
      {
        url: 'assets/data/recettes.json', storageKey: 'mobaria_recipes', timestampKey: 'mobaria_recipes_timestamp',
        stateUpdater: (data: any) => this.recipes.next(data)
      },
      {
        url: 'assets/data/items.json', storageKey: 'mobaria_items', timestampKey: 'mobaria_items_timestamp',
        stateUpdater: (data: any) => this.items.next(data)
      },
      {
        url: 'assets/data/dungeon.json', storageKey: 'mobaria_dungeons', timestampKey: 'mobaria_dungeons_timestamp',
        stateUpdater: (data: any) => this.dungeons.next(data)
      }
    ];

    // Initialiser l'état avec les données du cache si disponibles
    dataToLoad.forEach(data => {
      this.loadFromCacheOrRemote(data.url, data.storageKey, data.timestampKey, data.stateUpdater);
    });
  }

  /**
   * Charge les données depuis le cache ou depuis une source distante
   */
  private loadFromCacheOrRemote(
    url: string,
    storageKey: string,
    timestampKey: string,
    stateUpdater: (data: any) => void
  ): void {
    const cachedData = localStorage.getItem(storageKey);
    const shouldRefresh = this.shouldRefreshCache(timestampKey);

    // Si les données sont dans le cache et valides, les utiliser
    if (cachedData && !shouldRefresh) {
      console.log('Utilisation des données en cache pour ', storageKey, cachedData);
      const data = JSON.parse(cachedData);
      stateUpdater(data);
      return;
    }

    // Sinon, les charger depuis la source
    console.log(`Chargement des données depuis ${url}`);
    this.http.get(url).pipe(
      tap(data => {
        localStorage.setItem(storageKey, JSON.stringify(data));
        localStorage.setItem(timestampKey, Date.now().toString());
        stateUpdater(data);
      }),
      catchError(error => {
        console.error(`Erreur lors du chargement de ${url}:`, error);

        // En cas d'erreur, utiliser les données en cache si disponibles
        if (cachedData) {
          const data = JSON.parse(cachedData);
          stateUpdater(data);
        }

        throw error;
      })
    ).subscribe({
      complete: () => {
        // Vérifier si toutes les données sont chargées
        if (this.isAllDataLoaded()) {
          this.loading.next(false);
        }
      }
    });
  }  /**
   * Vérifie si toutes les données essentielles sont chargées
   */
  private isAllDataLoaded(): boolean {
    const allLoaded = (
      this.monsters.value.length > 0 &&
      this.classes.value.length > 0 &&
      this.zones.value.length > 0 &&
      this.items.value.length > 0 &&
      this.dungeons.value.length > 0  // Assurez-vous que les donjons sont chargés
    );

    if (allLoaded && !this.zonesEnriched.value) {
      console.log("Toutes les données sont chargées, enrichissement des zones...");
      // Une fois toutes les données chargées, enrichir les zones
      this.enrichZonesWithFullObjects();
      this.enrichMobsWithFullObjects();
    }

    return allLoaded;
  }


  private enrichMobsWithFullObjects(): void {

    const currentMobs = this.monsters.value;

    const enrichedMobs = currentMobs.map(mob => {
      const enrichedMob = { ...mob };
      if (enrichedMob.drops && Array.isArray(enrichedMob.drops)) {
        enrichedMob.drops = enrichedMob.drops
          .map(drop => {
            // drop.item peut être un id (string/number) ou un objet Item, on extrait l'id si besoin
            const itemId = typeof drop.item === 'object' && drop.item !== null ? drop.item.id : drop.item;
            const itemObj = this.getItem(itemId);
            if (!itemObj) {
              console.warn(`Item non trouvé pour l'ID: ${itemId} dans le drop du monstre ${mob.id}`);
              return null;
            }
            return { ...drop, item: itemObj };
          })
          .filter((drop): drop is typeof drop & { item: Item } => drop !== null);
      }

      console.log("Enrichissement du monstre:", enrichedMob.id, enrichedMob.drops);
      return enrichedMob;
    });

    this.monsters.next(enrichedMobs);
    localStorage.setItem("mobaria_mobs", JSON.stringify(enrichedMobs));
    this.zonesEnriched.next(true);
  }
  /**
 * Enrichit les zones avec les objets Monster et Dungeon complets
 */
  private enrichZonesWithFullObjects(): void {
    if (this.monsters.value.length === 0 || this.dungeons.value.length === 0) {
      console.warn("Impossible d'enrichir les zones : données manquantes");
      return;
    }

    const currentZones = this.zones.value;

    const enrichedZones = currentZones.map(zone => {
      // Créer une copie de la zone pour éviter de modifier l'original directement
      const enrichedZone = { ...zone };
      // Remplacer les IDs dans mobs_outside par les objets Monster complets
      if (enrichedZone.mobs_outside && Array.isArray(enrichedZone.mobs_outside)) {
        const processedMobIds = new Set(); // Pour éviter les doublons
        enrichedZone.mobs_outside = (enrichedZone.mobs_outside as any[]).map((mobId, index) => {
          // Si mobId est déjà un objet complet avec une propriété id, utiliser cette propriété
          const mobIdentifier = typeof mobId === 'object' && mobId !== null ? mobId.id : mobId.toString();

          // Si nous avons déjà traité cet ID, ajouter un index pour le rendre unique
          const uniqueId = processedMobIds.has(mobIdentifier) ? `${mobIdentifier}_${index}` : mobIdentifier;
          processedMobIds.add(mobIdentifier);

          const monster = this.getMonster(mobIdentifier);
          if (!monster) {
            console.warn(`Monstre non trouvé pour l'ID: ${mobIdentifier} dans la zone ${enrichedZone.id}`);
            return undefined;
          }

          // Assurer que l'objet a un ID unique s'il y a des doublons
          if (processedMobIds.has(mobIdentifier) && processedMobIds.size !== index + 1) {
            return { ...monster, uniqueTrackId: uniqueId };
          }

          return monster;
        }).filter(mob => mob !== undefined) as Monster[];
      }

      if (enrichedZone.dungeons && Array.isArray(enrichedZone.dungeons)) {
        const processedDungeonIds = new Set(); // Pour éviter les doublons
        enrichedZone.dungeons = (enrichedZone.dungeons as any[]).map((dungeonId, index) => {
          // Si dungeonId est déjà un objet complet avec une propriété id, utiliser cette propriété
          const dungeonIdentifier = typeof dungeonId === 'object' && dungeonId !== null ? dungeonId.id : dungeonId.toString();

          // Si nous avons déjà traité cet ID, ajouter un index pour le rendre unique
          const uniqueId = processedDungeonIds.has(dungeonIdentifier) ? `${dungeonIdentifier}_${index}` : dungeonIdentifier;
          processedDungeonIds.add(dungeonIdentifier);

          const dungeon = this.getDungeon(dungeonIdentifier);
          if (!dungeon) {
            console.warn(`Donjon non trouvé pour l'ID: ${dungeonIdentifier} dans la zone ${enrichedZone.id}`);
            return undefined;
          }

          // Assurer que l'objet a un ID unique s'il y a des doublons
          if (processedDungeonIds.has(dungeonIdentifier) && processedDungeonIds.size !== index + 1) {
            return { ...dungeon, uniqueTrackId: uniqueId };
          }

          return dungeon;
        }).filter(dungeon => dungeon !== undefined) as Dungeon[];
      }

      return enrichedZone;
    });
    localStorage.setItem("mobaria_zones", JSON.stringify(enrichedZones));
    // Mettre à jour le BehaviorSubject avec les zones enrichies
    this.zones.next(enrichedZones);
    this.zonesEnriched.next(true);
    console.log("Zones enrichies avec succès:", enrichedZones.length, this.zonesEnriched.value);
  }

  /**
   * Détermine si le cache doit être rafraîchi
   */
  private shouldRefreshCache(timestampKey: string): boolean {
    const timestampStr = localStorage.getItem(timestampKey);

    if (!timestampStr) return true;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    return now - timestamp > this.CACHE_VALIDITY_DURATION;
  }
  // Méthodes d'accès aux données
  getMonster(id: number): Monster | undefined {
    // Vérifier que nous avons des données à rechercher
    if (!this.monsters.value || this.monsters.value.length === 0) {
      return undefined;
    }

    // Assurer que la comparaison est faite avec des chaînes
    const monster = this.monsters.value.find(monster => monster.id == id);

    console.log("Monstre trouvé:", monster, this.monsters.value, id);
    return monster;
  }

  getClass(id: number): GameClass | undefined {
    return this.classes.value.find(gameClass => gameClass.id == id);
  }

  getZone(id: number): ZoneDetails | undefined {
    return this.zones.value.find(zone => zone.id == id);
  }

  getItem(id: number): Item | undefined {
    return this.items.value.find(item => item.id == id);
  }
  getDungeon(id: number): Dungeon | undefined {
    console.log("Recherche du donjon avec l'ID:", id);

    if (!this.dungeons.value || this.dungeons.value.length === 0) {
      console.warn("Aucun donjon n'est encore chargé dans l'état de l'application");
      return undefined;
    }

    const dungeon = this.dungeons.value.find(d => d.id === id);

    if (!dungeon) {
      console.warn(`Donjon non trouvé pour l'ID: ${id}, liste des donjons:`, this.dungeons.value.map(d => d.id));
    } else {
      console.log(`Donjon trouvé pour l'ID: ${id}`, dungeon);
    }

    return dungeon;
  }

  getDungeons(ids: number[]): Dungeon[] {
    return this.dungeons.value.filter(dungeon => ids.includes(dungeon.id));
  }

  /**
   * Force le rechargement des données depuis la source
   */
  refreshAllData(): void {
    this.loading.next(true);
    // Supprimer les timestamps pour forcer le rechargement
    localStorage.removeItem('mobaria_mobs_timestamp');
    localStorage.removeItem('mobaria_classes_timestamp');
    localStorage.removeItem('mobaria_zone_timestamp');
    localStorage.removeItem('mobaria_recipes_timestamp');
    localStorage.removeItem('mobaria_items_timestamp');
    localStorage.removeItem('mobaria_dungeons_timestamp');
    // Appel avec forceRefresh=true pour éviter la boucle
    this.initializeAppData(true);
  }
}
