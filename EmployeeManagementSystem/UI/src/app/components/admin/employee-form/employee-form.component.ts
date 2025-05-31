import {
  Component, EventEmitter, Input, Output,
  OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from '@angular/forms';
import {
  CreateEmployeeDto, UpdateEmployeeDto, Employee
} from '../../../models/employee.model';
import { RegisterDto } from '../../../models/auth.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Output() saved = new EventEmitter<CreateEmployeeDto | UpdateEmployeeDto>();
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;
  signaturePreview: SafeUrl | null = null;
  signatureData: string | null = null;

  get isEdit() {
    return !!this.employee;
  }

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalId: ['', Validators.required],
      age: [18, Validators.required],
      phoneNumber: ['', Validators.required],
      signature: [''],
      role: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee'] && this.form) {
      this.updateFormValues();
    }
  }

  ngOnInit() {
    this.updateFormValues();
  }

  private updateFormValues() {
    if (this.employee) {
      this.form.patchValue({
        ...this.employee,
        role: this.employee.role || ''
      });

      if (this.employee.signature) {
        this.signaturePreview = this.sanitizer.bypassSecurityTrustUrl(this.employee.signature);
        this.signatureData = this.employee.signature;
      }

      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.reset({
        age: 18,
        role: 'Employee'
      });

      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password')?.updateValueAndValidity();

      this.signaturePreview = null;
      this.signatureData = null;
    }
  }

  onSignatureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.signatureData = reader.result as string;
        this.signaturePreview = this.sanitizer.bypassSecurityTrustUrl(this.signatureData);
      };
      reader.readAsDataURL(file);
    }
  }

  removeSignature() {
    this.signaturePreview = null;
    this.signatureData = null;
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.isEdit) {
        const updateDto: UpdateEmployeeDto = {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          nationalId: formValue.nationalId,
          age: formValue.age,
          phoneNumber: formValue.phoneNumber,
          signature: this.signatureData || undefined
        };
        this.saved.emit(updateDto);
      } else {
        const registerDto: RegisterDto = {
          ...formValue,
          signature: this.signatureData || undefined,
          role: formValue.role || 'Employee'
        };
        this.saved.emit(registerDto);
      }
    }
  }

  close() {
    this.closed.emit();
  }
}
