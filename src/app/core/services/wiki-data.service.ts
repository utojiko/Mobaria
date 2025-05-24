import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Quest } from '../../models/quest.model';
import { Monster } from '../../models/monster.model';
import { GameClass } from '../../models/class.model';
import { Zone } from '../../models/zone.model';

// This service would typically fetch data from an API
// For demonstration, we're using hardcoded data

@Injectable({
  providedIn: 'root'
})
export class WikiDataService {
  private readonly CLASSES_STORAGE_KEY = 'mobaria_classes';
  private readonly CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';
  // Cache validity duration in milliseconds (e.g., 24 hours)
  private readonly CACHE_VALIDITY_DURATION = 24 * 60 * 60 * 1000;
  
  constructor(private http: HttpClient) {}
  
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
      return of(classes.find(c => c.id === id));
    }
    
    // If not in localStorage or cache expired, fetch all classes and then find the one by id
    return this.getClasses().pipe(
      map(classes => {
        console.log(`Recherche de la classe avec l'ID ${id} après chargement du JSON`);
        return classes.find(c => c.id === id);
      }),
      catchError(error => {
        console.error(`Erreur lors du chargement de la classe avec l'ID ${id}:`, error);
        
        // If there's cached data even if expired, try to use it as fallback
        if (cachedClasses) {
          console.log('Tentative d\'utilisation des données en cache comme solution de secours');
          const classes = JSON.parse(cachedClasses) as GameClass[];
          return of(classes.find(c => c.id === id));
        }
        
        return of(undefined);
      })
    );
  }
  
  getZones(): Observable<Zone[]> {
    return of([]); // Replace with mock data or actual API calls
  }
  
  getZoneById(id: string): Observable<Zone | undefined> {
    return of(undefined); // Replace with mock data or actual API calls
  }
}