"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 block">
                            Affordify
                        </Link>
                        <p className="text-soft-gray text-sm leading-relaxed mb-6">
                            Helping modern consumers make smarter buying decisions through data-driven recommendations, honest reviews, and constant price monitoring.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-soft-gray hover:text-primary transition-colors hover:bg-primary/5">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-soft-gray hover:text-primary transition-colors hover:bg-primary/5">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-soft-gray hover:text-primary transition-colors hover:bg-primary/5">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-soft-gray hover:text-primary transition-colors hover:bg-primary/5">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-soft-black font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-soft-gray">
                            <li><Link href="/deals" className="hover:text-primary transition-colors">Top Deals</Link></li>
                            <li><Link href="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                            <li><Link href="/price-tracking" className="hover:text-primary transition-colors">Price Tracking</Link></li>
                            <li><Link href="/guides" className="hover:text-primary transition-colors">Buying Guides</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-soft-black font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-soft-gray">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/legal" className="hover:text-primary transition-colors">Legal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-soft-black font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-soft-gray">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/disclosure" className="hover:text-primary transition-colors">Affiliate Disclosure</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-soft-gray max-w-2xl text-center md:text-left">
                        &copy; {new Date().getFullYear()} Affordify Inc. All rights reserved.
                        <span className="block mt-2">Affiliate Disclosure: Affordify is supported by its audience. When you purchase through links on our site, we may earn an affiliate commission.</span>
                    </p>
                    <div className="flex space-x-6 text-xs text-soft-gray font-medium">
                        <Link href="/sitemap" className="hover:text-primary">Sitemap</Link>
                        <Link href="/security" className="hover:text-primary">Security</Link>
                        <Link href="/cookies" className="hover:text-primary">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
