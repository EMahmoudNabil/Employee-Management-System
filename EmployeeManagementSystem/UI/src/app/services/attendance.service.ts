import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Attendance, WeeklyAttendance, WorkingHoursConfig } from '../models/attendance.model';
import { environment } from '../../environments/environment';
import { Toast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/attendance`;


  checkIn(): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/check-in`, {}, { observe: 'response' }).pipe(
      map(response => response.status === 200 || response.status === 201 || response.status === 204),
      catchError(error => {
        if (error.status === 400 && error.error?.includes("between 7:30 AM and 9:00 AM")) {
          console.warn("Check-in is allowed only between 7:30 AM and 9:00 AM");
          
          return of(false);
        }
        // إذا كان الخطأ هو 204 (No Content) أو 200 (OK)، فهذا يعني نجاح العملية
        if (error.status === 204 || error.status === 200) {
          return of(true);
        }
        throw error;
      })
    );
  }
  checkOut(): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/check-out`, {}, { observe: 'response' }).pipe(
      map(response => response.status === 200 || response.status === 201 || response.status === 204),
      catchError(error => {
        if (error.status === 400 && error.error?.includes("after 6:00 PM")) {
          console.warn("Check-out not allowed after 6:00 PM.");
          return of(false);
        }
  
        if (error.status === 204 || error.status === 200) {
          return of(true);
        }
  
        throw error;
      })
    );
  }
  
  getHistory(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/history`);
  }

  getTodayAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/today`);
  }

  getWeeklyWorkingHours(): Observable<any> {
    return this.http.get(`${this.apiUrl}/weekly-summary`);
  }
  
getWeeklyAttendanceSummary(): Observable<{ day: string, count: number }[]> {
      return this.http.get<{ day: string, count: number }[]>(`${this.apiUrl}/weekly-attendance-summary`);
    }
  

  getWorkingHoursConfig(): Observable<WorkingHoursConfig> {
    return this.http.get<WorkingHoursConfig>(`${this.apiUrl}/working-hours-config`);
  }

  updateWorkingHoursConfig(config: WorkingHoursConfig): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/working-hours-config`, config, { observe: 'response' }).pipe(
      map(response => response.status === 200 || response.status === 204),
      catchError(error => {
        if (error.status === 204 || error.status === 200) {
          return of(true);
        }
        throw error;
      })
    );
  }
} 