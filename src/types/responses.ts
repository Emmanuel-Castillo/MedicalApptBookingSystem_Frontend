import { AppointmentDto, TimeSlotDto, UserDto } from "./dtos";

export type GetDoctorInfoResponse = {
    doctor: UserDto;
    timeSlots: TimeSlotDto[];
}

export type GetPatientInfoResponse = {
    patient: UserDto;
    appointments: AppointmentDto[];
}