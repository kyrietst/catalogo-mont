import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
})

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    display: 'swap',
})

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Mont Distribuidora | Pão de Queijo Artesanal',
    description: 'Massas naturais congeladas e refrigeradas direto pra sua casa. Pão de queijo artesanal feito com alma na região do ABC paulista.',
    keywords: ['pão de queijo', 'chipa', 'massa congelada', 'artesanal', 'ABC paulista', 'São Bernardo'],
    authors: [{ name: 'Mont Distribuidora' }],
    openGraph: {
        title: 'Mont Distribuidora | Pão de Queijo Artesanal',
        description: 'Massas naturais congeladas e refrigeradas direto pra sua casa',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Mont Distribuidora',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
            <head>
                <link rel="preload" href="/hero-cheese/pao_left.png" as="image" />
                <link rel="preload" href="/hero-cheese/pao_right.png" as="image" />
                <link rel="preload" href="/hero-cheese/cheese.png" as="image" />
            </head>
            <body className="font-body bg-mont-cream text-mont-espresso antialiased">
                {children}
            </body>
        </html>
    )
}
