import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ProfileResponse } from '../../models/attendance.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: ProfileResponse | null = null;
  signatureData: string | null = null;

  constructor(
    private profileService: ProfileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  onSignatureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.signatureData = reader.result as string;
        this.uploadSignature();
      };
      reader.readAsDataURL(file);
    }
  }

  uploadSignature() {
    if (this.signatureData) {
      this.profileService.uploadSignature(this.signatureData).subscribe({
        next: () => {
          this.loadProfile();
        },
        error: (err) => {
          console.error('Failed to upload signature:', err);
        }
      });
    }
  }
}
