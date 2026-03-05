import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    getDealBySlug,
    type PinterestDeal
} from "@/lib/pinterestDeals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const buildMetadata = (deal: PinterestDeal): Metadata => ({
    title: deal.title,
    description: deal.description || `Explore ${deal.title} on Affordify.`,
    metadataBase: new URL(siteUrl),
    alternates: {
        canonical: `/deals/${deal.slug}`
    },
    openGraph: {
        title: deal.title,
        description: deal.description || `Explore ${deal.title} on Affordify.`,
        url: `/deals/${deal.slug}`,
        images: deal.imageUrl ? [{ url: deal.imageUrl }] : undefined,
        type: "product"
    },
    other: {
        "pinterest-rich-pin": "true"
    }
});

export async function generateMetadata({
    params
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const deal = await getDealBySlug(params.slug);
    if (!deal) {
        return {};
    }
    return buildMetadata(deal);
}

export default async function DealPage({
    params
}: {
    params: { slug: string };
}) {
    const deal = await getDealBySlug(params.slug);
    if (!deal) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: deal.title,
        description: deal.description,
        image: deal.imageUrl ? [deal.imageUrl] : undefined,
        url: `${siteUrl}/deals/${deal.slug}`,
        offers: deal.affiliateLink
            ? {
                  "@type": "Offer",
                  url: deal.affiliateLink
              }
            : undefined,
        sameAs: deal.pinUrl ?? undefined
    };

    return (
        <main className="min-h-screen bg-off-white px-6 md:px-12 py-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-3xl border border-cream shadow-soft overflow-hidden">
                    {deal.imageUrl && (
                        <img
                            src={deal.imageUrl}
                            alt={deal.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-soft-black mb-4">
                            {deal.title}
                        </h1>
                        <p className="text-lg text-soft-gray leading-relaxed">
                            {deal.description || "Details coming soon."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {deal.affiliateLink && (
                            <a
                                href={deal.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center justify-center"
                            >
                                View Deal
                            </a>
                        )}
                        {deal.pinUrl && (
                            <a
                                href={deal.pinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline inline-flex items-center justify-center"
                            >
                                View on Pinterest
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    );
}
