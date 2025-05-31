import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../services/attendance.service';
import { EmployeeService } from '../../../services/employee.service';
import { RouterModule } from '@angular/router';
import { Attendance } from '../../../models/attendance.model';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  todayAttendanceCount = 0;
  averageHours = 0;
  currentDate = new Date();
  dailyAttendance: Attendance[] = [];
  weeklyHours: { [employeeId: string]: number } = {};
  
  weeklyAttendanceData: any[] = [];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0']
  };

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadDailyAttendance();
    this.loadWeeklyHours();
    this.loadWeeklyAttendanceData();
  }

  loadSummary() {
    this.employeeService.getAll().subscribe({
      next: (employees) => this.totalEmployees = employees.length,
      error: (err) => console.error('Error loading employees:', err)
    });

    this.attendanceService.getTodayAttendance().subscribe({
      next: (records) => {
        this.todayAttendanceCount = records.length;
        if (records.length > 0) {
          const totalHours = records.reduce((sum, record) => {
            const checkIn = new Date(record.checkInTime);
            const checkOut = record.checkOutTime ? new Date(record.checkOutTime) : new Date();
            const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0);
          this.averageHours = totalHours / records.length;
        }
      },
      error: (err) => console.error('Error loading attendance:', err)
    });
  }

  loadDailyAttendance() {
    this.attendanceService.getTodayAttendance().subscribe({
      next: (records) => {
        console.log('Daily attendance records:', records); // Debugging line
        this.dailyAttendance = records},
      error: (err) => console.error('Error loading daily attendance:', err)
    });
  }
  
  loadWeeklyHours() {
    this.attendanceService.getWeeklyWorkingHours().subscribe({
      next: (summary) => {
        if (Array.isArray(summary)) {
          this.weeklyHours = summary.reduce((acc: any, item: any) => {
            acc[item.employeeId] = item.totalHours;
            return acc;
          }, {});
        } else {
          console.error('Unexpected summary format:', summary);
        }
      }
      ,      
      error: (err) => console.error('Error loading weekly hours:', err)
    });
  }


  loadWeeklyAttendanceData() {
      this.attendanceService.getWeeklyAttendanceSummary().subscribe({
        next: (data) => {
          this.weeklyAttendanceData = [
            {
              name: 'Week 1',
              series: data.map(item => ({
                name: item.day,
                value: item.count
              }))
            }
          ];
        },
        error: (err) => console.error('Error loading weekly attendance data:', err)
      });
    
  }
}
