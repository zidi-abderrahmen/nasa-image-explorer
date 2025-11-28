import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Apod } from '../models/apod.model';

@Injectable({
  providedIn: 'root',
})
export class NasaApi {
  private apiUrl = environment.nasaApiUrl;
  private apiKey = environment.nasaApiKey;

  constructor(private http: HttpClient) {}

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
    return this.http.get<Apod[]>(`${this.apiUrl}?api_key=${this.apiKey}&count=${count}`);
  }
}
