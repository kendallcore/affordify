import { fetchAllPinterestPinsRaw } from "../../services/pinterestService";
import { syncDealsFromPins } from "@/lib/pinterestDeals";

const SYNC_INTERVAL_MS = 30 * 60 * 1000;

const globalForScheduler = globalThis as {
    pinterestSyncStarted?: boolean;
    pinterestSyncTimer?: NodeJS.Timeout;
};

export const startPinterestSyncScheduler = () => {
    if (globalForScheduler.pinterestSyncStarted) {
        return;
    }
    globalForScheduler.pinterestSyncStarted = true;

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    if (!accessToken) {
        return;
    }

    const runSync = async () => {
        try {
            const rawPins = await fetchAllPinterestPinsRaw({ accessToken });
            await syncDealsFromPins(rawPins);
        } catch {
            // Swallow errors to keep the scheduler running.
        }
    };

    runSync();
    globalForScheduler.pinterestSyncTimer = setInterval(
        runSync,
        SYNC_INTERVAL_MS
    );
};
