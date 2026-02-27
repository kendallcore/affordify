"use client";

import { useEffect, useState } from "react";
import ProductCard from "../ui/ProductCard";
import { PINTEREST_BOARDS } from "@/data/pinterest-boards";

const API_BASE =
    process.env.NEXT_PUBLIC_AFFODIFY_API_BASE || "http://localhost:5000";

interface ApiProduct {
    title?: string;
    image?: string;
    link?: string;
    price?: string;
    description?: string;
}

interface FeaturedDealsProps {
    searchTerm: string;
    matchingBoardsCount: number;
}

const FALLBACK_PRODUCTS: ApiProduct[] = [
    {
        title: "Minimalist Desk Organizer",
        description: "Pinned from Pinterest: tidy up your workspace with a clean, affordable desk setup.",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
        price: "₹1,299",
        link: "https://www.amazon.in/"
    },
    {
        title: "Cozy Knit Throw Blanket",
        description: "Pinterest-inspired cozy layering for affordable deals on Amazon.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
        price: "₹2,199",
        link: "https://www.amazon.in/"
    },
    {
        title: "Skin-Glow Serum Bundle",
        description: "Trending Pinterest products curated for Amazon deals India shoppers.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
        price: "₹999",
        link: "https://www.amazon.in/"
    },
    {
        title: "Neutral Home Decor Set",
        description: "Board-pinned home decor favorites with affiliate-ready Amazon links.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
        price: "₹3,450",
        link: "https://www.amazon.in/"
    }
];

export default function FeaturedDeals({ searchTerm, matchingBoardsCount }: FeaturedDealsProps) {
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${API_BASE}/api/products`, {
                    cache: "no-store"
                });
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = (await res.json()) as ApiProduct[];
                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Unable to load products right now.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setIsFiltering(false);
            return;
        }
        setIsFiltering(true);
        const timer = window.setTimeout(() => {
            setIsFiltering(false);
        }, 250);
        return () => window.clearTimeout(timer);
    }, [searchTerm]);

    const normalizedQuery = searchTerm.trim().toLowerCase();
    const sourceProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;
    const filteredProducts = normalizedQuery.length
        ? sourceProducts.filter((product) => {
            const haystack = `${product.title || ""} ${product.description || ""}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        })
        : sourceProducts;
    const showNoResults =
        normalizedQuery.length > 0 && filteredProducts.length === 0 && matchingBoardsCount === 0;
    return (
        <section className="py-20 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-poppins font-extrabold text-soft-black mb-4">
                            Explore Top Deals
                        </h2>
                        <p className="text-soft-gray text-lg">
                            Affordable deals powered by Pinterest products and Amazon deals India shoppers love.
                        </p>
                    </div>
                    <a
                        href={PINTEREST_BOARDS[0].url}
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

                {(isLoading || isFiltering) && (
                    <div className="mb-8 flex items-center space-x-3 text-soft-gray text-sm">
                        <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        <span>Loading affordable deals...</span>
                    </div>
                )}

                {showNoResults && (
                    <div className="mb-8 text-sm text-soft-gray">
                        No matching products or boards found.
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={`${product.link || "product"}-${index}`}
                            name={product.title || "Amazon Product"}
                            description={product.description}
                            image={product.image}
                            price={product.price}
                            affiliateLink={product.link || "https://www.amazon.in/"}
                            ctaLabel="Buy on Amazon"
                        />
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <a
                        href={PINTEREST_BOARDS[0].url}
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
