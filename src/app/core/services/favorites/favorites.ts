import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apod } from '../../models/apod';

@Injectable({
  providedIn: 'root',
})

export class FavoritesService {
  private readonly STORAGE_KEY = 'nasa_favorites';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private favoritesSubject = new BehaviorSubject<Apod[]>([]);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.favoritesSubject.next(this.loadFavorites());
    }
  }

  get favorites$(): Observable<Apod[]> {
    return this.favoritesSubject.asObservable();
  }

  get favorites(): Apod[] {
    return this.favoritesSubject.value;
  }

  private loadFavorites(): Apod[] {
    if (!this.isBrowser) {
      return [];
    }
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavorites(favorites: Apod[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
    this.favoritesSubject.next(favorites);
  }

  addFavorite(apod: Apod): void {
    const current = this.favorites;
    if (!this.isFavorite(apod.date)) {
      this.saveFavorites([...current, apod]);
    }
  }

  removeFavorite(date: string): void {
    const updated = this.favorites.filter(f => f.date !== date);
    this.saveFavorites(updated);
  }

  isFavorite(date: string): boolean {
    return this.favorites.some(f => f.date === date);
  }

  toggleFavorite(apod: Apod): void {
    if (this.isFavorite(apod.date)) {
      this.removeFavorite(apod.date);
    } else {
      this.addFavorite(apod);
    }
  }
}
