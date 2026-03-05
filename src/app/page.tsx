"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedDeals from "@/components/sections/FeaturedDeals";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />
            <Hero />
            <FeaturedDeals />
            <Newsletter />
            <Footer />
        </main>
    );
}
