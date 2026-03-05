"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    const scrollToDeals = () => {
        const target = document.getElementById("explore-top-deals");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

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
                    <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 dark:bg-primary/20">
                        <span className="text-sm font-semibold uppercase tracking-wider">Live Pinterest Deals</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-poppins font-extrabold text-soft-black mb-6 leading-tight dark:text-white">
                        Discover deals worth saving.{" "}
                        <span className="text-primary">Updated automatically.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-soft-gray mb-10 leading-relaxed dark:text-slate-300">
                        Affordify syncs the latest pins from Kendall Core's Pinterest boards so you can
                        shop trending finds in one place. Fresh picks, real images, and direct links.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm text-soft-gray dark:text-slate-300">
                        <span className="px-4 py-2 rounded-full bg-white/70 border border-gray-100 shadow-sm dark:bg-slate-900/70 dark:border-slate-800">
                            Auto-synced pins
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/70 border border-gray-100 shadow-sm dark:bg-slate-900/70 dark:border-slate-800">
                            30-minute refresh
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/70 border border-gray-100 shadow-sm dark:bg-slate-900/70 dark:border-slate-800">
                            Direct Pinterest links
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <a
                            href="#explore-top-deals"
                            onClick={(event) => {
                                event.preventDefault();
                                scrollToDeals();
                            }}
                            className="btn-primary w-full sm:w-auto px-10 py-4 text-lg"
                        >
                            Explore Top Deals
                        </a>
                        <a
                            href="https://in.pinterest.com/kendallcore01/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors"
                        >
                            View Pinterest <ArrowRight size={18} className="ml-2" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
