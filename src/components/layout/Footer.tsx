"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100 dark:bg-slate-950 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 block">
                            Affordify
                        </Link>
                        <p className="text-soft-gray text-sm leading-relaxed mb-6 dark:text-slate-300">
                            Helping modern consumers make smarter buying decisions through data-driven recommendations, honest reviews, and constant price monitoring.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-soft-black font-bold mb-6 dark:text-white">Support</h4>
                        <ul className="space-y-4 text-sm text-soft-gray dark:text-slate-300">
                            <li><a href="mailto:kendall.core01@gmail.com" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 dark:border-slate-800">
                    <p className="text-xs text-soft-gray max-w-2xl text-center md:text-left dark:text-slate-400">
                        &copy; {new Date().getFullYear()} Affordify. All rights reserved.
                        <span className="block mt-2">Affiliate Disclosure: Affordify is supported by its audience. When you purchase through links on our site, we may earn an affiliate commission.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
