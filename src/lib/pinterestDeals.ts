import { promises as fs } from "node:fs";
import path from "node:path";

export type PinterestDeal = {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    pinUrl: string | null;
    affiliateLink: string | null;
    updatedAt: string;
};

export type PinterestRawPin = {
    id?: string;
    title?: string;
    description?: string;
    alt_text?: string;
    link?: string;
    url?: string;
    media?: {
        images?: Record<
            string,
            { url?: string; width?: number; height?: number }
        >;
    };
};

const DEALS_PATH = path.join(
    process.cwd(),
    "src/data/pinterest-deals.json"
);

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

const pickBestImage = (pin: PinterestRawPin): string | null => {
    const images = Object.values(pin.media?.images ?? {});
    if (images.length === 0) {
        return null;
    }
    const best = images
        .slice()
        .sort((a, b) => {
            const scoreA = (a.width ?? 0) * (a.height ?? 0);
            const scoreB = (b.width ?? 0) * (b.height ?? 0);
            return scoreB - scoreA;
        })[0];
    return best?.url ?? null;
};

const mapPinToDeal = (pin: PinterestRawPin): PinterestDeal => {
    const title = pin.title ?? pin.alt_text ?? "Untitled";
    const slugBase = slugify(title) || "pin";
    const id = pin.id ?? "";
    const slugSuffix = id ? `-${id.slice(-6)}` : "";
    return {
        id,
        slug: `${slugBase}${slugSuffix}`,
        title,
        description: pin.description ?? "",
        imageUrl: pickBestImage(pin),
        pinUrl: pin.url ?? (id ? `https://www.pinterest.com/pin/${id}/` : null),
        affiliateLink: pin.link ?? null,
        updatedAt: new Date().toISOString()
    };
};

export const readDeals = async (): Promise<PinterestDeal[]> => {
    try {
        const content = await fs.readFile(DEALS_PATH, "utf-8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch {
        return [];
    }
};

export const writeDeals = async (deals: PinterestDeal[]) => {
    await fs.writeFile(DEALS_PATH, JSON.stringify(deals, null, 2), "utf-8");
};

const dedupeDeals = (deals: PinterestDeal[]): PinterestDeal[] => {
    const result: PinterestDeal[] = [];
    const seenLinks = new Set<string>();
    const seenImages = new Set<string>();
    const seenTitles = new Set<string>();

    for (const deal of deals) {
        const link = (deal.affiliateLink || deal.pinUrl || "").toLowerCase().trim();
        const image = (deal.imageUrl || "").toLowerCase().trim();
        const title = (deal.title || "").toLowerCase().replace(/^(deal:\s*)/i, "").trim();

        if (
            (link && seenLinks.has(link)) ||
            (image && seenImages.has(image)) ||
            (title && seenTitles.has(title))
        ) {
            continue;
        }

        if (link) seenLinks.add(link);
        if (image) seenImages.add(image);
        if (title) seenTitles.add(title);
        result.push(deal);
    }

    return result;
};

export const syncDealsFromPins = async (
    rawPins: PinterestRawPin[]
): Promise<PinterestDeal[]> => {
    const existingDeals = await readDeals();
    const existingById = new Map(
        existingDeals.map((deal) => [deal.id, deal])
    );

    const nextDeals = rawPins.map((pin) => {
        const deal = mapPinToDeal(pin);
        const existing = existingById.get(deal.id);
        if (!existing) {
            return deal;
        }
        return {
            ...existing,
            ...deal,
            updatedAt: new Date().toISOString()
        };
    });

    const dedupedDeals = dedupeDeals(nextDeals);
    await writeDeals(dedupedDeals);
    return dedupedDeals;
};

export const getDealBySlug = async (slug: string) => {
    const deals = await readDeals();
    return deals.find((deal) => deal.slug === slug) ?? null;
};
