export function getFullImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('blob:')) return url; 
    
    // Explicitly check for development environment fallback
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    // If we're in development and the baseUrl is missing, fallback to localhost
    if (!baseUrl) {
        baseUrl = 'http://localhost:4000';
    }
    
    // Clean the URL to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseUrl}${cleanUrl}`;
}
