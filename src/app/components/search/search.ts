import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { NasaApi } from '../../core/services/nasa-api';
import { FavoritesService } from '../../core/services/favorites';
import { Apod } from '../../core/models/apod';
import { formatDateForApi } from '../../shared/utils/date.utils';
import { ApodCard } from '../../shared/components/apod-card/apod-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    ApodCard
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  selectedDate?: Date;
  startDate?: Date;
  endDate?: Date;
  maxDate = new Date();
  minDate = new Date('1995-06-16'); // First APOD date
  
  searchResults: Apod[] = [];
  loading = false;
  error?: string;
  searchType: 'single' | 'range' = 'single';

  constructor(
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService
  ) {}

  searchByDate(): void {
    if (!this.selectedDate) {
      this.error = 'Please select a date';
      return;
    }

    this.loading = true;
    this.error = undefined;
    const dateStr = formatDateForApi(this.selectedDate);

    this.nasaApi.getApodByDate(dateStr).subscribe({
      next: (data) => {
        this.searchResults = [data];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  searchByRange(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Please select both start and end dates';
      return;
    }

    if (this.startDate > this.endDate) {
      this.error = 'Start date must be before end date';
      return;
    }

    const daysDiff = Math.floor((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 100) {
      this.error = 'Date range cannot exceed 100 days due to API limitations';
      return;
    }

    this.loading = true;
    this.error = undefined;
    const startStr = formatDateForApi(this.startDate);
    const endStr = formatDateForApi(this.endDate);

    this.nasaApi.getApodRange(startStr, endStr).subscribe({
      next: (data) => {
        this.searchResults = data.reverse(); // Show newest first
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  setSearchType(type: 'single' | 'range'): void {
    this.searchType = type;
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchResults = [];
    this.error = undefined;
    this.selectedDate = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
  }

  toggleFavorite(apod: Apod, event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(apod);
  }

  isFavorite(date: string): boolean {
    return this.favoritesService.isFavorite(date);
  }
}
