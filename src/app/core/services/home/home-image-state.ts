import { Injectable } from '@angular/core';
import { Apod } from '../../models/apod';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeImageState {
  private apodSubject = new BehaviorSubject<Apod | undefined>(undefined);

  get apod$(): Observable<Apod | undefined> {
    return this.apodSubject.asObservable();
  }

  get currentApod(): Apod | undefined {
    return this.apodSubject.value;
  }

  setApod(apod: Apod | undefined): void {
    this.apodSubject.next(apod);
  }
}