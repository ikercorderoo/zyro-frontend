'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
