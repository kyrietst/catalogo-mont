'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface NavbarProps {
    cartItemCount?: number
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-mont-cream/95 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-display text-2xl sm:text-3xl font-bold text-mont-espresso hover:text-mont-gold transition-colors"
                    >
                        Mont
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/produtos"
                            className="font-body text-mont-espresso hover:text-mont-gold transition-colors"
                        >
                            Produtos
                        </Link>
                        <Link
                            href="/sobre"
                            className="font-body text-mont-espresso hover:text-mont-gold transition-colors"
                        >
                            Sobre
                        </Link>
                    </div>

                    {/* Cart Icon with Badge */}
                    <Link
                        href="/carrinho"
                        className="relative group"
                        aria-label={`Carrinho com ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'itens'}`}
                    >
                        <svg
                            className="w-6 h-6 text-mont-espresso group-hover:text-mont-gold transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>

                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-mont-gold text-mont-espresso text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
