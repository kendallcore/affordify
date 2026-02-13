import ProductCard from "../ui/ProductCard";
import DEALS from "@/data/featured-deals.json";

export default function FeaturedDeals() {
    return (
        <section className="py-20 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-poppins font-extrabold text-soft-black mb-4">
                            Featured Smart Deals
                        </h2>
                        <p className="text-soft-gray text-lg">
                            Hand-picked opportunities to save on the tech and luxury products you actually want. No junk, just value.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center space-x-2 text-primary font-bold border-b-2 border-primary mb-2 transition-opacity hover:opacity-70">
                        <span>See all 142 deals</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {DEALS.map((deal) => (
                        <ProductCard key={deal.id} {...deal} />
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <button className="w-full btn-outline">
                        View All Deals
                    </button>
                </div>
            </div>
        </section>
    );
}
