"use client";

import { Check, X, Star } from "lucide-react";
import COMPARISON_DATA from "@/data/comparison.json";

interface ComparisonItem {
    name: string;
    image: string;
    price: string;
    features: string[];
    rating: number;
    isBestOverall?: boolean;
    affiliateLink: string;
}

export default function ComparisonTable() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-poppins font-extrabold text-soft-black mb-4">
                        Compare The Best
                    </h2>
                    <p className="max-w-2xl mx-auto text-soft-gray text-lg">
                        We've tested dozens of products. Here's how the top contenders in noise-canceling headphones stack up.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {COMPARISON_DATA.map((item, idx) => (
                            <div
                                key={idx}
                                className={`relative rounded-3xl p-7 border transition-all duration-300 ${item.isBestOverall
                                    ? "border-primary/40 bg-primary/5 shadow-premium-hover"
                                    : "border-gray-100 bg-white shadow-premium"
                                    }`}
                            >
                                {item.isBestOverall && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-sm">
                                        Best Overall
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center">
                                    <div
                                        role="img"
                                        aria-label={item.name}
                                        className="w-32 h-32 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-primary/10 via-white to-accent/10 border border-gray-100 shadow-sm bg-center bg-cover"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    <h3 className="text-xl font-bold text-soft-black mb-1">{item.name}</h3>
                                    <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-sm font-bold text-soft-black">{item.rating}</span>
                                    </div>
                                    <span className="text-2xl font-poppins font-bold text-primary mb-6">{item.price}</span>

                                    <div className="w-full space-y-3.5 mb-8">
                                        {item.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center space-x-3 text-sm text-soft-gray">
                                                <Check size={16} className="text-accent flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <a
                                        href={item.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full py-3 rounded-lg font-bold transition-all text-center ${item.isBestOverall
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-gray-100 text-soft-black hover:bg-gray-200"
                                            }`}
                                    >
                                        Check Price
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
