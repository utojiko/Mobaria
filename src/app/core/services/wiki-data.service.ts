import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Quest } from '../../models/quest.model';
import { Monster } from '../../models/monster.model';
import { GameClass } from '../../models/class.model';
import { ZoneDetails } from '../../models/zone.model';
import { Dungeon } from '../../models/dungeon.model';
import { Item } from '../../models/item.model';
import { MobsService } from './wiki/mobs-services';
import { ClassesService } from './wiki/classes-services';
import { RecipesService } from './wiki/recipes-services';
import { ItemsService } from './wiki/items-services';
import { DungeonsService } from './wiki/dungeons-services';
import { ZonesService } from './wiki/zones-services';

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
  private readonly RECIPES_STORAGE_KEY = 'mobaria_recipes';
  private readonly RECIPES_TIMESTAMP_KEY = 'mobaria_recipes_timestamp';

  // Cache validity duration in milliseconds (e.g., 24 hours)
  private readonly CACHE_VALIDITY_DURATION = 24 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private mobsService: MobsService,
    private classesService: ClassesService,
    private recipesService: RecipesService,
    private itemsService: ItemsService,
    private dungeonsService: DungeonsService,
    private zonesService: ZonesService
  ) { }

  // Placeholder methods to simulate API calls
  // In a real implementation, these would fetch data from a backend

  getQuests(): Observable<Quest[]> {
    return of([]); // Replace with mock data or actual API calls
  }

  getQuestById(id: number): Observable<Quest | undefined> {
    return of(undefined); // Replace with mock data or actual API calls
  }

  getMonsters(): Observable<Monster[]> {
    return this.mobsService.getMonsters();
  }

  getMonsterById(id: number): Observable<Monster | undefined> {
    return this.mobsService.getMonsterById(id);
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
    return this.classesService.getClasses();
  }

  /**
   * Gets a specific game class by ID, either from localStorage if valid or from the JSON file
   */
  getClassById(id: number): Observable<GameClass | undefined> {
    return this.classesService.getClassById(id);
  }

  getZones(): Observable<ZoneDetails[]> {
    return this.zonesService.getZones();
  }

  getZoneById(id: number): Observable<ZoneDetails | undefined> {
    return this.zonesService.getZoneById(id);
  }

  getDungeons(): Observable<Dungeon[]> {
    return this.dungeonsService.getDungeons();
  }

  getDungeonById(id: number): Observable<Dungeon | undefined> {
    return this.dungeonsService.getDungeonById(id);
  }

  getRecipes(): Observable<any[]> {
    return this.recipesService.getRecipes();
  }

  getItems(): Observable<Item[]> {
    return this.itemsService.getItems();
  }

  getItemById(id: number): Observable<Item | undefined> {
    return this.itemsService.getItemById(id);
  }
}