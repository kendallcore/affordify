"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const storedTheme = window.localStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
            setTheme(storedTheme);
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
            return;
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const nextTheme = prefersDark ? "dark" : "light";
        setTheme(nextTheme);
        document.documentElement.classList.toggle("dark", prefersDark);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        window.localStorage.setItem("theme", nextTheme);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-slate-950/80 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Affordify
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="#explore-top-deals" className="text-soft-gray hover:text-primary font-medium transition-colors dark:text-slate-300 dark:hover:text-white">
                            Explore
                        </Link>
                        <Link href="https://in.pinterest.com/kendallcore01/" target="_blank" rel="noopener noreferrer" className="text-soft-gray hover:text-primary font-medium transition-colors dark:text-slate-300 dark:hover:text-white">
                            Pinterest
                        </Link>
                        <Link href="#newsletter" className="text-soft-gray hover:text-primary font-medium transition-colors dark:text-slate-300 dark:hover:text-white">
                            Newsletter
                        </Link>
                        <Link href="mailto:kendall.core01@gmail.com" className="text-soft-gray hover:text-primary font-medium transition-colors dark:text-slate-300 dark:hover:text-white">
                            Contact
                        </Link>
                        <Link href="/about" className="text-soft-gray hover:text-primary font-medium transition-colors dark:text-slate-300 dark:hover:text-white">
                            About
                        </Link>
                    </div>

                    {/* Action Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle color theme"
                            className="p-2 rounded-full text-soft-gray hover:text-primary transition-colors dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <a
                            href="#explore-top-deals"
                            className="btn-primary flex items-center space-x-2"
                        >
                            <ShoppingBag size={18} />
                            <span>Explore Deals</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button className="p-2 text-soft-gray dark:text-slate-300">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
