"use client";

export function Navbar() {
    const navLinks = [
        { name: 'Início', href: '#' },
        { name: 'Coberturas', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Sobre', href: '#' }
    ];

    return (
        // flex gap-8 ensures items are spaced but the container remains flush with the right edge
        <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="text-zinc-200 hover:text-volt text-[11px] font-bold tracking-widest transition-colors uppercase"
                >
                    {link.name}
                </a>
            ))}
        </nav>
    );
}