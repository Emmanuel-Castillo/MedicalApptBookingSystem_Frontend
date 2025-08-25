export type UserRole = "Patient" | "Doctor" | "Admin";
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export type UserDto = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type TimeSlotDto = {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctor: UserDto;
};

export type AppointmentDto = {
  id: number;
  timeSlotId: number;
  timeSlot: TimeSlotDto;
  patientId: number;
  patient: UserDto;
  notes?: string;
};

export type UserRegisterDto = {
  FullName: string;
  Email: string;
  Password: string;
  Role: UserRole;
};

export type UserLoginDto = {
  Email: string;
  Password: string;
};

export type DoctorAvailabilityDto = {
  id: number;
  doctor: UserDto;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
}

