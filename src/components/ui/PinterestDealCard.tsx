"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PinterestDealCardProps {
    title: string;
    description?: string;
    imageUrl: string;
    pinUrl: string;
}

export default function PinterestDealCard({
    title,
    description,
    imageUrl,
    pinUrl
}: PinterestDealCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full overflow-hidden dark:bg-slate-900 dark:border-slate-800"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-poppins font-bold text-soft-black mb-6 group-hover:text-primary transition-colors dark:text-slate-100">
                    {title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-slate-800">
                    <a
                        href={pinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary font-bold hover:translate-x-1 transition-transform"
                    >
                        <span>View Deal</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
