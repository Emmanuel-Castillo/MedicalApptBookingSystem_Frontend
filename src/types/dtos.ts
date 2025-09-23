export type UserRole = "Patient" | "Doctor" | "Admin";
export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
}

export type UserDto = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type TimeSlotDto = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctor: DoctorProfileDto;
};

export type AppointmentDto = {
  id: number;
  timeSlotId: number;
  timeSlot: TimeSlotDto;
  patientId: number;
  patient: PatientProfileDto;
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
};

export type DoctorProfileDto = {
  id: number;
  specialty: string;
  userId: number;
  user: UserDto;
};

export type PatientProfileDto = {
  id: number;
  weightImperial: number;
  heightImperial: number;
  userId: number;
  user: UserDto;
};
