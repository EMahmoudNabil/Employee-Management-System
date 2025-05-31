export interface Employee {
    id?: string;
    userName?: string;
    email: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    age: number;
    phoneNumber: string;
    signature?: string;
    role?: string;
}

export interface CreateEmployeeDto {
    email: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    age: number;
    phoneNumber: string;
    signature?: string;
    password: string;
}

export interface UpdateEmployeeDto {
    firstName: string;
    lastName: string;
    nationalId: string;
    age: number;
    phoneNumber: string;
    signature?: string;
}

export interface EmployeeQueryParameters {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
