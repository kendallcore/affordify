export const metadata = {
    title: "About Affordify",
    description:
        "Affordify is a smart deal discovery platform powered by Pinterest inspiration and real shopping trends."
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white px-6 md:px-12 py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-soft-black mb-6">
                    About Affordify
                </h1>
                <p className="text-lg text-soft-gray leading-relaxed mb-8">
                    Affordify is a smart deal discovery platform designed to help
                    shoppers find the best products at the best prices. The
                    platform curates trending products, top deals, and popular
                    recommendations powered by Pinterest inspiration and real
                    shopping trends.
                </p>
                <p className="text-lg text-soft-gray leading-relaxed mb-10">
                    Our mission is to simplify online shopping by showcasing
                    products people love while helping users discover affordable
                    alternatives and trending deals in one place.
                </p>

                <h2 className="text-2xl font-poppins font-bold text-soft-black mb-4">
                    What Affordify offers:
                </h2>
                <ul className="text-soft-gray text-lg space-y-3 mb-10">
                    <li>Curated deals inspired by Pinterest trends</li>
                    <li>Product discovery based on popular pins</li>
                    <li>Easy access to trending products</li>
                    <li>Simple comparison and shopping guidance</li>
                </ul>

                <p className="text-lg text-soft-gray leading-relaxed">
                    Affordify is built to help users <strong>buy smarter and live
                    better</strong> by highlighting products that are already
                    trending and loved by online communities.
                </p>
            </div>
        </main>
    );
}
