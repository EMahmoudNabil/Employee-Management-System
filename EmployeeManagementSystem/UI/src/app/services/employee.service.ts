import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError, of, map } from 'rxjs';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryParameters } from '../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface FilterParams {
  search?: string;
  sortBy?: string;
  pageNumber: number;
  pageSize: number;
  sortDescending: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Employee`;

  constructor(private toastr: ToastrService) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching employees:', error);
        return throwError(() => error);
      })
    );
  }

  getFilteredEmployees(filters: FilterParams): Observable<{ employees: Employee[], totalCount: number }> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
  
    params = params
      .set('pageNumber', filters.pageNumber)
      .set('pageSize', filters.pageSize)
      .set('sortDescending', filters.sortDescending);
  
    if (params.keys().length > 3) { 
      return this.http.get<{ employees: Employee[], totalCount: number }>(
        `${this.apiUrl}/filter`,
        { params }
      );
    } else {
      return this.http.get<{ employees: Employee[], totalCount: number }>(
        `${this.apiUrl}/filter`
      );
    }
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      catchError(error => {
        if (error.status === 204) {
          return of({} as Employee);
        }
        return throwError(() => error);
      })
    );
  }

  updateEmployee(id: number, employee: UpdateEmployeeDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee).pipe(
      catchError(error => {
        if (error.status === 204) {
          return of(void 0);
        }
        return throwError(() => error);
      })
    );
  }

  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
      map(response => response.status === 204 || response.status === 200),
      catchError(error => {
        if (error.status === 204) {
          return of(true);
        }
        return throwError(() => error);
      })
    );
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showError(message: string): void {
    this.toastr.error(message);
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: CreateEmployeeDto): Observable<any> {
    return this.http.post(this.apiUrl, employee);
  }

  update(id: string, employee: UpdateEmployeeDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
      map(response => response.status === 204 || response.status === 200),
      catchError(error => {
        if (error.status === 204) {
          return of(true);
        }
        return throwError(() => error);
      })
    );
  }

  getPaged(parameters: EmployeeQueryParameters): Observable<{ totalCount: number; data: Employee[] }> {
    return this.http.get<{ totalCount: number; data: Employee[] }>(`${this.apiUrl}/paged`, {
      params: { ...parameters }
    });
  }
}