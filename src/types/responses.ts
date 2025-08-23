import { AppointmentDto, TimeSlotDto, UserDto } from "./dtos";

export type GetDoctorInfoResponse = {
    doctor: UserDto;
    upcomingTimeSlots: TimeSlotDto[];
}

export type GetPatientInfoResponse = {
    patient: UserDto;
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