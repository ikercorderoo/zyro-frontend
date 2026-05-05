const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('zyro_token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('zyro_token');
            localStorage.removeItem('zyro_user');
            window.location.href = '/login';
        }
    }

    const rawText = await response.text();
    let data: any = null;

    if (rawText) {
        try {
            data = JSON.parse(rawText);
        } catch {
            data = { message: rawText };
        }
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            response.statusText ||
            `Request failed (${response.status})`;

        const error = new Error(message) as Error & { status?: number; data?: any };
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
