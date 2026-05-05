'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(`/login?callbackUrl=${pathname}`);
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Redirect to their own dashboard if role not allowed
                if (user.role === 'CLIENT') router.push('/client/dashboard');
                else if (user.role === 'PROFESSIONAL') router.push('/professional/dashboard');
                else if (user.role === 'ADMIN') router.push('/admin/dashboard');
            }
        }
    }, [user, loading, router, allowedRoles, pathname]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If user role is not allowed, show nothing while redirecting
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
