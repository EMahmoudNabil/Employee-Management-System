export interface Attendance {
    id?: string;
    employeeId: string;
    firstName: string;
    checkInTime: Date;
    checkOutTime?: Date;
    workingHours?: string;
}

export interface WeeklyAttendance {
    checkInTime: Date;
    checkOutTime?: Date;
    workingHours?: string;
}

export interface ProfileResponse {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        nationalId: string;
        age: number;
        signature?: string;
    };
    weeklyAttendance: WeeklyAttendance[];
}

export interface WorkingHoursConfig {
    checkInStartTime: string;  // Format: "HH:mm"
    checkInEndTime: string;    // Format: "HH:mm"
    checkOutTime: string;      // Format: "HH:mm"
} 