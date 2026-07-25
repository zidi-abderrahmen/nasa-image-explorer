import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NasaApi } from '../../core/services/nasa/nasa-api';
import { FavoritesService } from '../../core/services/favorites/favorites';
import { Apod } from '../../core/models/apod';
import { HomeImageState } from '../../core/services/home/home-image-state';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  todayApod?: Apod;
  loading = true;
  error?: string;

  constructor(
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService,
    private homeImageState: HomeImageState
  ) {}

  ngOnInit(): void {
    this.homeImageState.apod$.subscribe(apod => {
      this.todayApod = apod;
    });

    if (!this.homeImageState.currentApod) {
      this.loadTodayApod();
    } else {
      this.loading = false;
    }
  }

  loadTodayApod(): void {
    this.loading = true;
    this.nasaApi.getTodayApod().subscribe({
      next: (data) => {
        this.homeImageState.setApod(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleFavorite(): void {
    if (this.todayApod) {
      this.favoritesService.toggleFavorite(this.todayApod);
    }
  }

  isFavorite(): boolean {
    return this.todayApod ? this.favoritesService.isFavorite(this.todayApod.date) : false;
  }
}
