import { NextResponse } from "next/server";
import {
    syncDealsFromPins,
    readDeals,
    type PinterestRawPin
} from "@/lib/pinterestDeals";
import { fetchPinterestPins, fetchPinsWithFallback } from "@/lib/pinterestApi";
import { startPinterestSyncScheduler } from "@/lib/pinterestScheduler";

export const runtime = "nodejs";

startPinterestSyncScheduler();

const CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 24;

type CacheEntry = {
    fetchedAt: number;
    pins: PinterestPin[];
};

const globalForPinterest = globalThis as unknown as {
    pinterestCache?: CacheEntry;
};

type PinterestPin = {
    image: string;
    title: string;
    description: string;
    link: string;
};

const getCachedPins = () => {
    const cached = globalForPinterest.pinterestCache;
    if (!cached) {
        return null;
    }
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) {
        return null;
    }
    return cached.pins;
};

const setCachedPins = (pins: PinterestPin[]) => {
    globalForPinterest.pinterestCache = {
        pins,
        fetchedAt: Date.now(),
    };
};

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

const mapPins = (rawPins: PinterestRawPin[]): PinterestPin[] =>
    rawPins
        .map((pin) => {
            const image = pickBestImage(pin);
            const link =
                pin.url ??
                (pin.id ? `https://www.pinterest.com/pin/${pin.id}/` : null);
            if (!image || !link) {
                return null;
            }
            return {
                image,
                title: pin.title ?? pin.alt_text ?? "Untitled",
                description: pin.description ?? "",
                link
            };
        })
        .filter(Boolean) as PinterestPin[];

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
    const boardId = searchParams.get("boardId");
    const fallbackBoardId = process.env.PINTEREST_BOARD_ID ?? null;
    const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

    try {
        const rawPins = boardId
            ? await fetchPinterestPins({
                  accessToken,
                  boardId,
                  pageSize
              })
            : await fetchPinsWithFallback({
                  accessToken,
                  fallbackBoardId,
                  pageSize
              });
        const pins = mapPins(rawPins);
        await syncDealsFromPins(rawPins);

        setCachedPins(pins);

        return NextResponse.json(
            { pins, cached: false },
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
