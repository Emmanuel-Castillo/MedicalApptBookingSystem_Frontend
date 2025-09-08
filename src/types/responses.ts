import { AppointmentDto, DoctorProfileDto, PatientProfileDto, TimeSlotDto, UserDto } from "./dtos";

export type GetDoctorInfoResponse = {
    doctorProfile: DoctorProfileDto;
    bookedTimeSlotsNextTwoWeeks: TimeSlotDto[];
}

export type GetPatientInfoResponse = {
    patientProfile: PatientProfileDto;
    appointmentsThisWeek: AppointmentDto[];
}

export type GetTimeSlotResponse = {
    timeSlot: TimeSlotDto;
    appointment?: AppointmentDto;
}

export type GetDoctorsTimeSlotsResponse = {
    timeSlotDtos: TimeSlotDto[];
    totalCount: number;
}

export type GetPatientsAppointmentsResponse = {
    appointments: AppointmentDto[];
    totalCount: number;
}

export type GetAvailableTimeSlotsResponse = {
    availableTimeSlotDtos: TimeSlotDto[];
    totalCount: number;
}

export type GetAllAppointmentsResponse = {
    listAppointmentDto: AppointmentDto[];
    totalCount: number;
}