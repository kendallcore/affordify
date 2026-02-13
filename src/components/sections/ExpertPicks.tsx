import ProductCard from "../ui/ProductCard";
import EXPERT_PICK from "@/data/expert-picks.json";

export default function ExpertPicks() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Curated Excellence</span>
                    <h2 className="text-4xl font-poppins font-extrabold text-soft-black">Expert's Choice</h2>
                </div>

                <div className="bg-off-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-premium flex flex-col lg:flex-row">
                    <div className="lg:w-3/5 relative h-[400px] lg:h-auto">
                        <img src={EXPERT_PICK.image} alt={EXPERT_PICK.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                    </div>
                    <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                            <div className="w-8 h-[2px] bg-primary"></div>
                            <span className="uppercase tracking-widest text-xs">Editor's Recommended</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-poppins font-extrabold text-soft-black mb-6">
                            {EXPERT_PICK.name}
                        </h3>
                        <p className="text-soft-gray text-lg leading-relaxed mb-8">
                            {EXPERT_PICK.description}
                        </p>
                        <div className="flex items-center justify-between items-center mb-8">
                            <div>
                                <span className="text-3xl font-poppins font-bold text-soft-black">{EXPERT_PICK.price}</span>
                                <p className="text-xs text-soft-gray mt-1">Free overnight shipping included</p>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400">
                                <span className="text-lg font-bold text-soft-black mr-1">{EXPERT_PICK.rating}</span>
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className="fas fa-star text-sm"></i>
                                ))}
                            </div>
                        </div>
                        <a
                            href={EXPERT_PICK.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary py-4 text-lg w-full text-center"
                        >
                            Buy Smarter with Affordify
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
