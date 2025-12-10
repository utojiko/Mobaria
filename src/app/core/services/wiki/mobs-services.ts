import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Monster } from '../../../models/monster.model';
import { AppStateService } from '../../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class MobsService {
  constructor(private http: HttpClient, private appState: AppStateService) {}

  getMonsters(): Observable<Monster[]> {
    return this.appState.monsters$;
  }
  getMonsterById(id: number): Observable<Monster | undefined> {
    // D'abord, vérifier si nous avons déjà les données en mémoire
    const cachedMonster = this.appState.getMonster(id);
    
    // Si le monstre est trouvé en cache, le retourner immédiatement
    if (cachedMonster) {
      console.log('Monster found in app state cache:', cachedMonster);
      return of(cachedMonster);
    }
    
    // Sinon, utiliser l'observable pour attendre que les données soient chargées
    return this.appState.monsters$.pipe(
      map(monsters => {
        const monster = monsters.find(m => m.id === id);
        console.log('Monster from observable:', monster);
        return monster;
      })
    );
  }
}