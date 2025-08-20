import { AppointmentDto, TimeSlotDto, UserDto } from "./dtos";

export type GetDoctorInfoResponse = {
    doctor: UserDto;
    timeSlots: TimeSlotDto[];
}

export type GetPatientInfoResponse = {
    patient: UserDto;
    appointments: AppointmentDto[];
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
    appointmentDtos: AppointmentDto[];
    totalCount: number;
}