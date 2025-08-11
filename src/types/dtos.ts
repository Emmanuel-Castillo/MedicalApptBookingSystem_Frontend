export type UserRole = "Patient" | "Doctor" | "Admin";

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
  email: string;
  password: string;
};

