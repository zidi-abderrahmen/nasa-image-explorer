import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NasaApi } from '../../core/services/nasa-api';
import { FavoritesService } from '../../core/services/favorites';
import { Apod } from '../../core/models/apod';
import { ApodCard } from '../../shared/components/apod-card/apod-card';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ApodCard
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
        this.error = err.message;
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
        this.error = err.message;
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
