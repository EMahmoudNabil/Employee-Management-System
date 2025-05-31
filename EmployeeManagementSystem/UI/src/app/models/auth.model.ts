export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    age: number;
    phoneNumber: string;
    signature?: string;
    role: string;
}

export interface AuthResponse {
    token: string;
} 