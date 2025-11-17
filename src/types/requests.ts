import { DayOfWeek } from "./dtos";

export type BookAppointmentRequest = {
  PatientId?: string;
  TimeSlotId: number;
};

export type CreateTimeSlotRequest = {
  DoctorId: string;
  Date: string;
  StartTime: string;
  EndTime: string;
};

export type DeleteAppointmentRequest = {
  AppointmentId: number;
};

export type DeleteTimeSlotRequest = {
  TimeSlotId: number;
};

export type GetDoctorInfoRequest = {
  DoctorId?: string;
};

export type GetDoctorTimeSlotsRequest = {
  DoctorId?: string;
};

export type GePatientAppointmentsRequest = {
  PatientId?: string;
};

export type ChangeUserRequest = {
  id: string;
  newFullName: string;
  newEmail: string;
};

export type SetDoctorAvailRequest = {
  doctorId: number;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
};

export type UpdateApptNotesRequest = {
  updatedNotes?: string;
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
}