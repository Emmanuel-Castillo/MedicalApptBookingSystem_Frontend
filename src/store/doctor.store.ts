import { create } from "zustand";
import { DoctorProfileDto, TimeSlotDto } from "../types/dtos";

interface DoctorStore {
  isLoading: boolean;
  errors: string[];
  doctor: DoctorProfileDto | null;
  timeSlots: TimeSlotDto[];
  updateDoctor: (value: DoctorProfileDto | null) => void;
  getDoctorDetails: () => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
  doctor: null,
  isLoading: true,
  errors: [],
  timeSlots: [],
  updateDoctor: (value) => set({ doctor: value }),
  getDoctorDetails: async() => {
    
  }
}));
