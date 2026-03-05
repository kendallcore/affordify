"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedDeals from "@/components/sections/FeaturedDeals";
import Newsletter from "@/components/sections/Newsletter";
import { PINTEREST_BOARDS } from "@/data/pinterest-boards";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const matchingBoards = useMemo(() => {
        const normalizedQuery = searchTerm.trim().toLowerCase();
        if (!normalizedQuery) {
            return [];
        }
        return PINTEREST_BOARDS.filter((board) =>
            board.name.toLowerCase().includes(normalizedQuery)
        );
    }, [searchTerm]);

    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />
            <Hero
                searchTerm={searchTerm}
                matchingBoards={matchingBoards}
                onSearchChange={setSearchTerm}
            />
            <FeaturedDeals
                searchTerm={searchTerm}
                matchingBoardsCount={matchingBoards.length}
            />
            <Newsletter />
            <Footer />
        </main>
    );
}
