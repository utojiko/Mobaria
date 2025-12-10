import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from '../../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  constructor(private http: HttpClient, private appState: AppStateService) {}

  getRecipes(): Observable<any[]> {
    return this.appState.recipes$;
  }
}
