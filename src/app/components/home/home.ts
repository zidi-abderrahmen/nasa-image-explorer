import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NasaApi } from '../../core/services/nasa-api';
import { FavoritesService } from '../../core/services/favorites';
import { Apod } from '../../core/models/apod';

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
    public favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadTodayApod();
  }

  loadTodayApod(): void {
    this.loading = true;
    this.nasaApi.getTodayApod().subscribe({
      next: (data) => {
        this.todayApod = data;
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
