export type Role = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    lastName?: string;
    email: string;
    role: Role;
    phone?: string;
    specialty?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Feedback {
    id: string;
    bookingId: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    notes?: string;
    services: BookingService[];
    staff?: any;
    user?: User;
    feedback?: Feedback;
}

export interface BookingService {
    bookingId: string;
    serviceId: string;
    price: number;
    duration: number;
    service: Service;
}

export interface Service {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    business: Business;
    addons?: ServiceAddon[];
}

export interface ServiceAddon {
    id: string;
    serviceId: string;
    name: string;
    price: number;
    duration: number;
    active: boolean;
}

export interface Business {
    id: string;
    name: string;
    slug: string;
    description?: string;
    minLeadTime: number;
    maxBookingWindow: number;
    cancellationWindow: number;
    bufferTime: number;
    slotInterval: number;
    schedules?: Schedule[];
}

export interface Schedule {
    id?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
