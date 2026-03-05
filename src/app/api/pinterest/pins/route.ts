import { NextResponse } from "next/server";
import { syncDealsFromPins } from "@/lib/pinterestDeals";
import {
    fetchAllPinterestPinsRaw,
    mapPinterestPins
} from "../../../../../services/pinterestService";
import { startPinterestSyncScheduler } from "@/lib/pinterestScheduler";

export const runtime = "nodejs";

startPinterestSyncScheduler();

const CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 24;
const MAX_PINS = 40;
const CACHE_VERSION = 3;

type CacheEntry = {
    version: number;
    fetchedAt: number;
    pins: PinterestPin[];
};

const globalForPinterest = globalThis as unknown as {
    pinterestCache?: CacheEntry;
};

type PinterestPin = {
    id: string;
    image: string;
    title: string;
    description: string;
    link: string;
    createdAt?: string | null;
    destination?: string | null;
};

const getCachedPins = () => {
    const cached = globalForPinterest.pinterestCache;
    if (!cached) {
        return null;
    }
    if (cached.version !== CACHE_VERSION) {
        return null;
    }
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) {
        return null;
    }
    return cached.pins;
};

const setCachedPins = (pins: PinterestPin[]) => {
    globalForPinterest.pinterestCache = {
        version: CACHE_VERSION,
        pins,
        fetchedAt: Date.now(),
    };
};

const sortPinsNewestFirst = (pins: PinterestPin[]) =>
    pins
        .slice()
        .sort((a, b) => {
            const dateA = a.createdAt ? Date.parse(a.createdAt) : 0;
            const dateB = b.createdAt ? Date.parse(b.createdAt) : 0;
            return dateB - dateA;
        });

const stripMetadata = (pins: PinterestPin[]) =>
    pins.map(({ createdAt, destination, ...rest }) => rest);

const dedupePinsById = (pins: PinterestPin[]) => {
    const deduped = new Map<string, PinterestPin>();
    for (const pin of pins) {
        const id = pin.id?.toString().trim();
        if (!id || deduped.has(id)) {
            continue;
        }
        deduped.set(id, pin);
    }
    return Array.from(deduped.values());
};

const normalizeUrl = (value?: string | null) => {
    if (!value) {
        return "";
    }
    try {
        const parsed = new URL(value);
        return `${parsed.origin}${parsed.pathname}`.toLowerCase();
    } catch {
        return value.trim().toLowerCase();
    }
};

const dedupePinsByContent = (pins: PinterestPin[]) => {
    const deduped = new Map<string, PinterestPin>();
    for (const pin of pins) {
        const destination = normalizeUrl(pin.destination);
        const image = normalizeUrl(pin.image);
        const key = destination || image || pin.id;
        if (!key || deduped.has(key)) {
            continue;
        }
        deduped.set(key, pin);
    }
    return Array.from(deduped.values());
};

export async function GET(request: Request) {
    const cachedPins = getCachedPins();
    if (cachedPins) {
        return NextResponse.json(
            { pins: cachedPins, cached: true },
            {
                headers: {
                    "Cache-Control": "public, max-age=0, s-maxage=1800",
                },
            }
        );
    }

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    if (!accessToken) {
        console.error("Missing PINTEREST_ACCESS_TOKEN environment variable.");
        return NextResponse.json(
            { error: "Missing Pinterest access token." },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

    try {
        const rawPins = await fetchAllPinterestPinsRaw({ accessToken, pageSize });
        const pins = mapPinterestPins(rawPins) as PinterestPin[];
        const dedupedPins = dedupePinsById(pins);
        const contentUniquePins = dedupePinsByContent(dedupedPins);
        const sortedPins = sortPinsNewestFirst(contentUniquePins).slice(
            0,
            MAX_PINS
        );
        const responsePins = stripMetadata(sortedPins);
        await syncDealsFromPins(rawPins);

        setCachedPins(responsePins);

        return NextResponse.json(
            { pins: responsePins, cached: false },
            {
                headers: {
                    "Cache-Control": "public, max-age=0, s-maxage=1800",
                },
            }
        );
    } catch (error) {
        console.error("Pinterest API error", error);
        return NextResponse.json(
            {
                error: "Failed to fetch pins from Pinterest.",
                details:
                    error instanceof Error ? error.message : "Unknown error."
            },
            { status: 502 }
        );
    }
}
