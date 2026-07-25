import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Apod } from '../../models/apod';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class NasaApi {
  private apiUrl = environment.nasaApiUrl;
  private apiKey = environment.nasaApiKey;

  constructor(@Inject(HttpClient) private http: HttpClient) {}

  getTodayApod(): Observable<Apod> {
    return this.http.get<Apod>(`${this.apiUrl}?api_key=${this.apiKey}`);
  }

  getApodByDate(date: string): Observable<Apod> {
    return this.http.get<Apod>(`${this.apiUrl}?api_key=${this.apiKey}&date=${date}`);
  }

  getApodRange(startDate: string, endDate: string): Observable<Apod[]> {
    return this.http.get<Apod[]>(
      `${this.apiUrl}?api_key=${this.apiKey}&start_date=${startDate}&end_date=${endDate}`
    );
  }

  getRandomApods(count: number = 10): Observable<Apod[]> {
    return this.http.get<Apod[]>(`${this.apiUrl}?api_key=${this.apiKey}&count=${count}&thumbs=true`);
  }
}
