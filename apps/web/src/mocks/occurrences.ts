export interface Occurrence {
    id: string;
    title: string;
    location: string;
    photoCount: number;
    photographerCount: number;
    data: string;
    images: string[];
    tag?: 'novo' | 'destaque'; // Optional tag field
}

export const MOCK_OCCURRENCES: Occurrence[] = [
    {
        id: '1',
        title: 'Surf Pro Tour 2026',
        location: 'Praia do Meio, São Luís',
        photoCount: 842,
        photographerCount: 12,
        data: '02/03/2026',
        tag: 'novo', // Initial launch entry
        images: [
            "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format",
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format",
            "https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=600&auto=format",
            "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=600&auto=format"
        ]
    },
    // ... other events without a tag for now
];