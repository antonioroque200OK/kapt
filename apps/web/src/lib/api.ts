const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new ApiError(res.status, text);
    }

    return res.json() as Promise<T>;
}

export function requestOTP(contact: string): Promise<void> {
    return post<void>('/auth/otp/request', { contact });
}

export function verifyOTP(contact: string, code: string): Promise<{ token: string }> {
    return post<{ token: string }>('/auth/otp/verify', { contact, code });
}

export async function submitSelfie(
    blob: Blob,
    consentType: 'global' | 'event',
    token: string,
): Promise<void> {
    const form = new FormData();
    form.append('selfie', blob, 'selfie.jpg');
    form.append('consent_type', consentType);

    const res = await fetch(`${API_BASE}/identification/selfie`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new ApiError(res.status, text);
    }
}
