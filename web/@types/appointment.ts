import { ReactNode } from "react";

export interface Appointment {
  id: string
  professionalName: string
  professionalSpecialty?: string
  professionalImage?: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  price: string
  isCanceled?: boolean
  status?: string
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  action: () => void;
}

export interface FadeInAnimation {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  exit: { opacity: number; y: number };
  transition: { duration: number };
}
