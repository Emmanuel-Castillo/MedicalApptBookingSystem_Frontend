import { DayOfWeek } from "./dtos";

export type BookAppointmentRequest = {
  PatientId?: string;
  TimeSlotId: number;
};

export type CreateTimeSlotRequest = {
  DoctorId?: string;
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
  doctorId: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
};
