import { fetchAllPinterestPinsRaw } from "../../services/pinterestService";
import { syncDealsFromPins } from "@/lib/pinterestDeals";

const SYNC_INTERVAL_MS = 15 * 60 * 1000;

const globalForScheduler = globalThis as {
    pinterestSyncStarted?: boolean;
    pinterestSyncTimer?: NodeJS.Timeout;
};

export const startPinterestSyncScheduler = () => {
    if (globalForScheduler.pinterestSyncStarted) {
        return;
    }
    globalForScheduler.pinterestSyncStarted = true;

    const runSync = async () => {
        try {
            const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
            const rawPins = await fetchAllPinterestPinsRaw({ accessToken });
            if (Array.isArray(rawPins) && rawPins.length > 0) {
                await syncDealsFromPins(rawPins);
                console.log(`[Pinterest Sync] Synced ${rawPins.length} pins from Pinterest.`);
            }
        } catch (err) {
            console.warn("[Pinterest Sync] Sync attempt encountered error:", err);
        }
    };

    runSync();
    globalForScheduler.pinterestSyncTimer = setInterval(
        runSync,
        SYNC_INTERVAL_MS
    );
};
