import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [MatIconModule, CommonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  stars = Array(20).fill(0).map((_, i) => i);
  goBack(): void {
    window.history.back();
  }
}
