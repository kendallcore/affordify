"use client";

import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
    return (
        <section className="py-20 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-16 shadow-premium border border-gray-100 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-12">
                    <div className="max-w-md">
                        <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-soft-black mb-4">
                            Join thousands of <span className="text-primary">smart shoppers</span>.
                        </h2>
                        <p className="text-soft-gray text-lg">
                            Get our weekly curated list of top deals, expert reviews, and price tracking alerts. No spam, ever.
                        </p>
                    </div>
                    <div className="w-full max-w-md">
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-soft-gray group-focus-within:text-primary transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-off-white border border-gray-200 rounded-xl py-4 pl-12 pr-32 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-soft-black"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center space-x-2">
                                <span>Join Now</span>
                                <ArrowRight size={16} />
                            </button>
                        </form>
                        <p className="mt-4 text-xs text-soft-gray">
                            By joining, you agree to our Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
