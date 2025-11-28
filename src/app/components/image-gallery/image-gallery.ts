import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NasaApi } from '../../services/nasa-api';
import { FavoritesService } from '../../services/favorites';
import { Apod } from '../../models/apod.model';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.scss',
})
export class ImageGallery {
  apods: Apod[] = [];
  loading = false;
  error?: string;

  constructor(
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadRandomApods();
  }

  loadRandomApods(): void {
    this.loading = true;
    this.error = undefined;
    this.nasaApi.getRandomApods(12).subscribe({
      next: (data) => {
        this.apods = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load images';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadMore(): void {
    this.loading = true;
    this.nasaApi.getRandomApods(12).subscribe({
      next: (data) => {
        this.apods = [...this.apods, ...data];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load more images';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleFavorite(apod: Apod, event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(apod);
  }

  isFavorite(date: string): boolean {
    return this.favoritesService.isFavorite(date);
  }
}
