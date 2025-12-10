import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from '../../services/app-state.service';
import { Dungeon } from '../../../models/dungeon.model';

@Injectable({
  providedIn: 'root'
})
export class DungeonsService {
  constructor(private http: HttpClient, private appState: AppStateService) {}

  getDungeons(): Observable<Dungeon[]> {
    return this.appState.dungeons$;
  }
  
  getDungeonById(id: number): Observable<Dungeon | undefined> {
    // D'abord, vérifier si nous avons déjà les données en mémoire
    const cachedDungeon = this.appState.getDungeon(id);

    // Si le donjon est trouvé en cache, le retourner immédiatement
    if (cachedDungeon) {
      console.log('Dungeon found in app state cache:', cachedDungeon);
      return of(cachedDungeon);
    }
    
    // Sinon, utiliser l'observable pour attendre que les données soient chargées
    return this.appState.dungeons$.pipe(
      map(dungeons => {
        const dungeon = dungeons.find(m => m.id === id);
        console.log('Dungeon from observable:', dungeon);
        return dungeon;
      })
    );
  }
}