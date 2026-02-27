"use client";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
    id?: string;
    name: string;
    brand?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    rating?: number;
    reviews?: number;
    image?: string;
    isEditorChoice?: boolean;
    affiliateLink: string;
    ctaLabel?: string;
}

export default function ProductCard({
    name,
    brand,
    description,
    price,
    originalPrice,
    rating,
    reviews,
    image,
    isEditorChoice,
    affiliateLink,
    ctaLabel
}: ProductCardProps) {
    const showRating = typeof rating === "number" && typeof reviews === "number";
    const displayBrand = brand || "Amazon";
    const displayPrice = price || "Check Price";
    const displayDescription = description || "See details on Amazon.";
    const displayCtaLabel = ctaLabel || "View Deal";
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full overflow-hidden"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {isEditorChoice && (
                    <div className="absolute top-4 left-4 z-10 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        Editor's Choice
                    </div>
                )}
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-soft-gray">
                        No image
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">{displayBrand}</span>
                    {showRating && (
                        <div className="flex items-center space-x-1 text-yellow-400">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold text-soft-black">{rating}</span>
                            <span className="text-xs text-soft-gray">({reviews})</span>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-poppins font-bold text-soft-black mb-2 group-hover:text-primary transition-colors">
                    {name}
                </h3>

                <p className="text-sm text-soft-gray mb-6 flex-grow line-clamp-2">
                    {displayDescription}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-2xl font-poppins font-bold text-soft-black">{displayPrice}</span>
                        {originalPrice && (
                            <span className="text-xs text-soft-gray line-through">{originalPrice}</span>
                        )}
                    </div>
                    <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary font-bold hover:translate-x-1 transition-transform"
                    >
                        <span>{displayCtaLabel}</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
