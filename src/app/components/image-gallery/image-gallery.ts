import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NasaApi } from '../../core/services/nasa/nasa-api';
import { FavoritesService } from '../../core/services/favorites/favorites';
import { Apod } from '../../core/models/apod';
import { ApodCard } from '../../shared/components/apod-card/apod-card';
import { ApodSkeletonCard } from '../../shared/components/apod-skeleton-card/apod-skeleton-card';
import { GalleryState } from '../../core/services/gallery/gallery-state';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
    ApodCard,
    ApodSkeletonCard
  ],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.scss',
})
export class ImageGallery {
  apods: Apod[] = [];
  loading = false;
  error?: string;
  readonly skeletonCount = 12;

  constructor(
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService,
    private galleryState: GalleryState
  ) {}

  ngOnInit(): void {
    this.galleryState.apods$.subscribe(apods => {
      this.apods = apods;
    });

    if (this.galleryState.currentApods.length === 0) {
      this.loadRandomApods();
    }
  }

  loadRandomApods(): void {
    this.loading = true;
    this.error = undefined;
    this.apods = [];
    this.nasaApi.getRandomApods(this.skeletonCount).subscribe({
      next: (data) => {
        this.galleryState.setApods(data); 
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
        this.galleryState.addApods(data);
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