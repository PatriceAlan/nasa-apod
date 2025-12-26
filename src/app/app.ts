import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  apodData: ApodData | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  maxDate: string = new Date().toISOString().split('T')[0];
  loading: boolean = true;
  error: string | null = null;
  
  private apiUrl = 'https://api.nasa.gov/planetary/apod';
  private apiKey = 'EG0TopA09dXSn0dRSnaGl6iZsgdV3d9CqQ8JNTGY';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAPOD();
  }

  fetchAPOD(): void {
    this.loading = true;
    this.error = null;

    this.http.get<ApodData>(
      `${this.apiUrl}?api_key=${this.apiKey}&date=${this.selectedDate}`
    ).subscribe({
      next: (data) => {
        this.apodData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des données';
        this.loading = false;
      }
    });
  }

  changeDate(days: number): void {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    const newDate = currentDate.toISOString().split('T')[0];
    
    if (newDate <= this.maxDate) {
      this.selectedDate = newDate;
      this.fetchAPOD();
    }
  }

  onDateChange(): void {
    this.fetchAPOD();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isToday(): boolean {
    return this.selectedDate === this.maxDate;
  }
}