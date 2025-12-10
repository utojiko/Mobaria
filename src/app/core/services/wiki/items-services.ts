import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../../models/item.model';
import { AppStateService } from '../../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private http: HttpClient, private appState: AppStateService) {}

  getItems(): Observable<Item[]> {
    return this.appState.items$;
  }

  getItemById(id: number): Observable<Item | undefined> {
    return this.appState.items$.pipe(
      map(items => items.find(item => item.id === id))
    );
  }
}
