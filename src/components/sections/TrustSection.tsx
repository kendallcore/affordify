"use client";

import { ShieldCheck, BarChart3, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const TRUST_METRICS = [
    {
        icon: <BarChart3 size={32} />,
        title: "Data-Driven",
        description: "We analyze thousands of data points and price history to provide real-time recommendations."
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Honest Reviews",
        description: "Our experts test products for weeks to ensure they meet our high-performance standards."
    },
    {
        icon: <Clock size={32} />,
        title: "Price Monitoring",
        description: "We track price drops across 50+ major retailers 24/7 so you never miss a deal."
    },
    {
        icon: <Users size={32} />,
        title: "Consumer-First",
        description: "Affordify is built for shoppers, not brands. We prioritize your budget and needs above all else."
    }
];

export default function TrustSection() {
    return (
        <section className="py-24 bg-primary text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-poppins font-extrabold mb-6 leading-tight">
                            Why Trust <span className="text-accent">Affordify?</span>
                        </h2>
                        <p className="text-primary/20 bg-white/10 text-xl font-medium p-6 rounded-2xl mb-8 border border-white/10">
                            "Affordify isn't just about finding the cheapest items. It's about finding the best value for your hard-earned money."
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {TRUST_METRICS.map((metric, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="text-accent mb-4">{metric.icon}</div>
                                    <h4 className="text-xl font-bold mb-2">{metric.title}</h4>
                                    <p className="text-white/70 text-sm leading-relaxed">{metric.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
                                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold">98%</div>
                                    <div className="text-sm">Of users find better prices through Affordify.</div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
                                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold">$420</div>
                                    <div className="text-sm">Average annual savings per active member.</div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
                                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold">12k</div>
                                    <div className="text-sm">Verified smart shoppers trust our daily picks.</div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
