import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-apod-skeleton-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgxSkeletonLoaderModule],
  templateUrl: './apod-skeleton-card.html',
  styleUrl: './apod-skeleton-card.scss',
})
export class ApodSkeletonCard {}