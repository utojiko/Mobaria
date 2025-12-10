import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GameClass } from '../../../models/class.model';
import { AppStateService } from '../../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  constructor(private http: HttpClient, private appState: AppStateService) {}

  getClasses(): Observable<GameClass[]> {
    return this.appState.classes$;
  }

  getClassById(id: number): Observable<GameClass | undefined> {
    return this.appState.classes$.pipe(
      map(classes => classes.find(c => c.id === id))
    );
  }
}
