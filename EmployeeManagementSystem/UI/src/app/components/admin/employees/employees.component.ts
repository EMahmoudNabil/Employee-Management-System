// employees.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { CreateEmployeeDto, Employee, UpdateEmployeeDto } from '../../../models/employee.model';
import { RouterModule } from '@angular/router';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { AuthService } from '../../../services/auth.service';
import { RegisterDto } from '../../../models/auth.model';

declare var bootstrap: any;

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,FilterPipe,EmployeeFormComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
 
employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  modalInstance: any;
  deleteModalInstance: any;
  employeeToDelete: string | null = null;

  searchTerm: string = '';

  loading: boolean = false; // Add this property to indicate loading state

currentPage = 1;
pageSize = 5;
sortField: keyof Employee = 'firstName';
sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private employeeService: EmployeeService ,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.employeeService.showError('Failed to load employees');
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.selectedEmployee = null;
    this.showModal();
  }

 


openEditModal(employee: Employee) {
  if (!employee.id) return;

  this.employeeService.getById(employee.id).subscribe({
    next: (fullEmployee) => {
      this.selectedEmployee = fullEmployee;
      // Only show modal after data is loaded
      setTimeout(() => {
        const modalElement = document.getElementById('employeeModal');
        if (modalElement) {
          this.modalInstance = new bootstrap.Modal(modalElement);
          this.modalInstance.show();
        }
      }, 0);
    },
    error: (err) => {
      console.error('Failed to load employee:', err);
      this.employeeService.showError('Failed to load employee data');
    }
  });
}


  showModal() {
    const modalElement = document.getElementById('employeeModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
onSave(data: CreateEmployeeDto | UpdateEmployeeDto) {
  if (this.selectedEmployee) {
    // Edit existing employee
    const updateDto: UpdateEmployeeDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      nationalId: data.nationalId,
      age: data.age,
      phoneNumber: data.phoneNumber,
      signature: data.signature
    };

    this.employeeService.update(this.selectedEmployee.id!, updateDto).subscribe({
      next: (response) => {
        this.employeeService.showSuccess('Employee updated successfully');
        this.loadEmployeesAndClose();
      },
      error: (error) => {
        console.error('Update error:', error);
        // Check if the error is due to successful update but failed response
        if (error.status === 204 || error.status === 200) {
          this.employeeService.showSuccess('Employee updated successfully');
          this.loadEmployeesAndClose();
        } else {
          this.employeeService.showError('Failed to update employee');
        }
      }
    });
  } else {
    // Add new employee
    const registerDto: RegisterDto = {
      email: (data as CreateEmployeeDto).email,
      password: (data as CreateEmployeeDto).password,
      firstName: data.firstName,
      lastName: data.lastName,
      nationalId: data.nationalId,
      age: data.age,
      phoneNumber: data.phoneNumber,
      signature: data.signature,
      role: (data as any).role || 'Employee'
    };

    this.authService.register(registerDto).subscribe({
      next: (response) => {
        this.employeeService.showSuccess('Employee added successfully');
        // Wait a short moment to ensure backend has processed the registration
        setTimeout(() => {
          this.loadEmployeesAndClose();
        }, 500);
      },
      error: (error) => {
        console.error('Registration error:', error);
        // Check if the error is due to successful registration but failed response
        if (error.status === 201 || error.status === 200) {
          this.employeeService.showSuccess('Employee added successfully');
          setTimeout(() => {
            this.loadEmployeesAndClose();
          }, 500);
        } else {
          this.employeeService.showError('Failed to add employee');
        }
      }
    });
  }
}


loadEmployeesAndClose() {
  this.loading = true;
  this.employeeService.getAll().subscribe({
    next: (data) => {
      this.employees = data;
      this.closeModal();
      this.selectedEmployee = null;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading employees:', err);
      // Even if loading fails, close the modal and reset state
      this.closeModal();
      this.selectedEmployee = null;
      this.loading = false;
      // Try to refresh the list one more time
      setTimeout(() => {
        this.employeeService.getAll().subscribe({
          next: (retryData) => {
            this.employees = retryData;
          },
          error: (retryErr) => {
            console.error('Retry loading error:', retryErr);
            this.employeeService.showError('Failed to refresh employee list');
          }
        });
      }, 1000);
    }
  });
}

  deleteEmployee(id: string) {
    this.employeeToDelete = id;
    this.showDeleteModal();
  }

  showDeleteModal() {
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModalInstance = new bootstrap.Modal(modalElement);
      this.deleteModalInstance.show();
    }
  }

  closeDeleteModal() {
    if (this.deleteModalInstance) {
      this.deleteModalInstance.hide();
      this.employeeToDelete = null;
    }
  }

  confirmDelete() {
    if (!this.employeeToDelete) return;

    this.loading = true;
    this.employeeService.delete(this.employeeToDelete).subscribe({
      next: (success) => {
        if (success) {
          this.employeeService.showSuccess('Employee deleted successfully');
          this.closeDeleteModal();
          this.loadEmployees();
        } else {
          this.employeeService.showError('Failed to delete employee');
        }
      },
      error: (error) => {
        console.error('Delete error:', error);
        // Check if the error is actually a success case
        if (error.status === 204 || error.status === 200) {
          this.employeeService.showSuccess('Employee deleted successfully');
          this.closeDeleteModal();
          this.loadEmployees();
        } else {
          this.employeeService.showError('Failed to delete employee');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


get pagedEmployees(): Employee[] {
    const sorted = [...this.employees].sort((a, b) => {
      const aValue = a[this.sortField]?.toString().toLowerCase() || '';
      const bValue = b[this.sortField]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  
    const start = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }
  
  changeSort(field: keyof Employee) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
  getPageCount(): number[] {
    return Array(Math.ceil(this.employees.length / this.pageSize)).fill(0).map((_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.employees.length / this.pageSize);
  }
  
}
