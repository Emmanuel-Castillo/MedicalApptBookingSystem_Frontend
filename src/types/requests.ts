export type BookAppointmentRequest = {
  PatientId?: string;
  TimeSlotId: number;
};

export type CreateTimeSlotRequest = {
    DoctorId?: string;
    StartTime: string;
    EndTime: string;
}

export type DeleteAppointmentRequest = {
    AppointmentId: number;
}

export type DeleteTimeSlotRequest = {
    TimeSlotId: number;
}

export type GetDoctorInfoRequest = {
    DoctorId?: string;
}

export type GetDoctorTimeSlotsRequest = {
    DoctorId?: string;
}

export type GePatientAppointmentsRequest = {
    PatientId?: string;
}
