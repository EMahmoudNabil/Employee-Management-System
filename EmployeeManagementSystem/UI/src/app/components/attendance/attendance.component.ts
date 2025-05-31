import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../models/attendance.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendanceHistory: Attendance[] = [];
  isCheckedIn = false;
  isCheckedOut = false;
  checkInError = '';
  loading = false;

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadAttendanceHistory();
  }

  checkIn() {
    this.loading = true;
    this.checkInError = '';

    this.attendanceService.checkIn().subscribe({
      next: (success) => {
        if (success) {
          const now = new Date();
          this.isCheckedIn = true;
          this.toastr.success(`Checked in successfully at ${now.toLocaleTimeString()}`);
          this.loadAttendanceHistory();
        } else {
          this.toastr.error('Check-in is allowed only between 7:30 AM and 9:00 AM');
        }
      },
      error: (error) => {
        console.error('Check-in error:', error);
        this.checkInError = error.error?.message || 'Failed to check in';
        this.toastr.error(this.checkInError);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  checkOut() {
    this.loading = true;
    this.attendanceService.checkOut().subscribe({
      next: (success) => {
        if (success) {
          this.isCheckedOut = true;
          const now = new Date();
          this.toastr.success(`Checked out successfully at ${now.toLocaleTimeString()}`);
          this.loadAttendanceHistory();
        } else {
          this.toastr.error('Failed to check out. Please try again.');
        }
      },
      error: (error) => {
        console.error('Check-out error:', error);
        const message = error.error?.message || 'Failed to check out';
        this.toastr.error(message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadAttendanceHistory() {
    this.loading = true;
    this.attendanceService.getHistory().subscribe({
      next: (data) => {
        this.attendanceHistory = data;

        const today = new Date().toDateString();
        this.isCheckedIn = data.some(record =>
          new Date(record.checkInTime).toDateString() === today
        );
        this.isCheckedOut = data.some(record =>
          new Date(record.checkInTime).toDateString() === today &&
          record.checkOutTime !== null
        );
      },
      error: (error) => {
        console.error('Error loading attendance history:', error);
        this.toastr.error('Failed to load attendance history');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
