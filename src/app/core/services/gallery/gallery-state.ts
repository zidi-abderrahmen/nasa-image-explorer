import { Injectable } from '@angular/core';
import { Apod } from '../../models/apod';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryState {
  private apodsSubject = new BehaviorSubject<Apod[]>([]);

  get apods$(): Observable<Apod[]> {
    return this.apodsSubject.asObservable();
  }

  get currentApods(): Apod[] {
    return this.apodsSubject.value;
  }

  setApods(apods: Apod[]): void {
    this.apodsSubject.next(apods);
  }

  addApods(newApods: Apod[]): void {
    const current = this.currentApods;
    this.apodsSubject.next([...current, ...newApods]);
  }
}
