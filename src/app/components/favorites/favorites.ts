import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FavoritesService } from '../../core/services/favorites';
import { Apod } from '../../core/models/apod';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  favorites: Apod[] = [];

  constructor(public favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = [...favorites].reverse(); // Show newest first
    });
  }

  removeFavorite(date: string, event: Event): void {
    event.stopPropagation();
    this.favoritesService.removeFavorite(date);
  }

  clearAllFavorites(): void {
    if (confirm('Are you sure you want to remove all favorites?')) {
      this.favorites.forEach(fav => this.favoritesService.removeFavorite(fav.date));
    }
  }
}
