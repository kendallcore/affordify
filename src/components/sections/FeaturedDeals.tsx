"use client";

import { useEffect, useState } from "react";
import PinterestDealCard from "../ui/PinterestDealCard";

interface FeaturedDealsProps {
}

interface PinterestDeal {
    image: string;
    title: string;
    description: string;
    link: string;
}

export default function FeaturedDeals({}: FeaturedDealsProps) {
    const [pins, setPins] = useState<PinterestDeal[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch("/api/pinterest/pins", { cache: "no-store" });
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = (await res.json()) as { pins?: PinterestDeal[] };
                if (!cancelled) {
                    setPins(Array.isArray(data.pins) ? data.pins : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Unable to load Pinterest pins right now.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        load();
        const interval = window.setInterval(load, REFRESH_INTERVAL_MS);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [REFRESH_INTERVAL_MS]);

    const sourceDeals = pins.filter(
        (pin) => pin.image && pin.link
    ) as Array<PinterestDeal & { image: string; link: string }>;

    const filteredProducts = sourceDeals.reduce<PinterestDeal[]>((acc, current) => {
        const normLink = current.link.toLowerCase().trim();
        const normImg = current.image.toLowerCase().trim();
        const normTitle = current.title.toLowerCase().replace(/^(deal:\s*)/i, "").trim();

        const exists = acc.some((item) => {
            const itemLink = item.link.toLowerCase().trim();
            const itemImg = item.image.toLowerCase().trim();
            const itemTitle = item.title.toLowerCase().replace(/^(deal:\s*)/i, "").trim();
            return itemLink === normLink || itemImg === normImg || itemTitle === normTitle;
        });

        if (!exists) {
            acc.push(current);
        }
        return acc;
    }, []);
    return (
        <section
            id="explore-top-deals"
            className="py-20 bg-off-white dark:bg-slate-900 scroll-mt-28"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-poppins font-extrabold text-soft-black mb-4 dark:text-white">
                            Explore Top Deals
                        </h2>
                        <p className="text-soft-gray text-lg dark:text-slate-300">
                            Affordable deals powered by Pinterest products and Amazon deals India shoppers love.
                        </p>
                    </div>
                    <a
                        href="https://in.pinterest.com/kendallcore01/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center space-x-2 text-primary font-bold border-b-2 border-primary mb-2 transition-opacity hover:opacity-70"
                    >
                        <span>See all Pinterest boards</span>
                    </a>
                </div>

                {error && (
                    <div className="mb-6 text-sm text-red-600">{error}</div>
                )}

                {isLoading && (
                    <div className="mb-8 flex items-center space-x-3 text-soft-gray text-sm dark:text-slate-300">
                        <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        <span>Loading affordable deals...</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((pin, index) => (
                        <PinterestDealCard
                            key={`${pin.link}-${index}`}
                            title={pin.title}
                            description={pin.description}
                            imageUrl={pin.image}
                            pinUrl={pin.link}
                        />
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <a
                        href="https://in.pinterest.com/kendallcore01/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-outline inline-flex items-center justify-center"
                    >
                        View Pinterest Boards
                    </a>
                </div>
            </div>
        </section>
    );
}
