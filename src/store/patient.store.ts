import { create } from "zustand";
import { PatientProfileDto } from "../types/dtos";

interface PatientStore {
  patient: PatientProfileDto | null;
  updatePatient: (value: PatientProfileDto | null) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  patient: null,
  updatePatient: (value) => set({ patient: value }),
}));
