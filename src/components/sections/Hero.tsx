"use client";

import { Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <TrendingUp size={16} />
                        <span className="text-sm font-semibold uppercase tracking-wider">Smart Shopping Companion</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-poppins font-extrabold text-soft-black mb-6 leading-tight">
                        Buy Smarter. <span className="text-primary">Live Better.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-soft-gray mb-10 leading-relaxed">
                        Affordify finds the best products at the best prices — so you never overpay again. Data-driven recommendations for the tech-savvy shopper.
                    </p>

                    <div className="max-w-3xl mx-auto relative mb-12">
                        <div className="flex items-center bg-white shadow-premium border border-gray-100 rounded-2xl p-2 transition-all focus-within:shadow-premium-hover focus-within:border-primary/20">
                            <div className="px-4 text-soft-gray">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for premium tech, home essentials, and more..."
                                className="w-full py-4 text-lg outline-none bg-transparent"
                            />
                            <button className="hidden sm:block btn-primary whitespace-nowrap px-8">
                                Search Deals
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                            <span className="text-sm text-soft-gray">Trending:</span>
                            <a href="#" className="text-sm text-primary hover:underline">iPhone 16 Pro</a>
                            <a href="#" className="text-sm text-primary hover:underline">Herman Miller</a>
                            <a href="#" className="text-sm text-primary hover:underline">Sony WH-1000XM5</a>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
                            Explore Top Deals
                        </button>
                        <button className="btn-outline w-full sm:w-auto px-10 py-4 text-lg">
                            Read Expert Reviews
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
