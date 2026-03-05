"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Affordify
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/about" className="text-soft-gray hover:text-primary font-medium transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Action Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="p-2 text-soft-gray hover:text-primary transition-colors">
                            <Search size={20} />
                        </button>
                        <button className="btn-primary flex items-center space-x-2">
                            <ShoppingBag size={18} />
                            <span>Explore Deals</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button className="p-2 text-soft-gray">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
