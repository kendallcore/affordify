import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedDeals from "@/components/sections/FeaturedDeals";
import ExpertPicks from "@/components/sections/ExpertPicks";
import ComparisonTable from "@/components/ui/ComparisonTable";
import TrustSection from "@/components/sections/TrustSection";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />
            <Hero />
            <FeaturedDeals />
            <ExpertPicks />
            <ComparisonTable />
            <TrustSection />
            <Newsletter />
            <Footer />
        </main>
    );
}
