import { NextResponse } from "next/server";
import { syncDealsFromPins } from "@/lib/pinterestDeals";
import { fetchAllPinterestPinsRaw } from "../../../../../services/pinterestService";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    if (!accessToken) {
        return NextResponse.json(
            { error: "Missing Pinterest access token." },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const pageSize = Number(searchParams.get("pageSize") ?? 24);

    try {
        const rawPins = await fetchAllPinterestPinsRaw({
            accessToken,
            pageSize
        });
        const deals = await syncDealsFromPins(rawPins);
        return NextResponse.json({ deals, synced: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to sync Pinterest pins.",
                details:
                    error instanceof Error ? error.message : "Unknown error."
            },
            { status: 502 }
        );
    }
}
