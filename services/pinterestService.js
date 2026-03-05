const PINTEREST_API_BASE = "https://api.pinterest.com/v5";
const DEFAULT_PAGE_SIZE = 24;
const DEFAULT_CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 12000;

const extractItems = (payload) => {
    if (Array.isArray(payload?.items)) {
        return payload.items;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    return [];
};

const requestPinterest = async (url, accessToken) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
    );

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
        const body = await response.text();
        console.error("Pinterest API request failed", {
            url,
            status: response.status,
            body
        });
        if (response.status === 401 || response.status === 403) {
            console.error("Pinterest access token appears invalid or expired.");
        }
        throw new Error(`Pinterest API error (${response.status}): ${body}`);
    }

    return response.json();
};

const fetchPinsForBoards = async ({ accessToken, boardIds, pageSize }) => {
    const allPins = [];
    let index = 0;
    const concurrency = Math.min(
        DEFAULT_CONCURRENCY,
        Math.max(boardIds.length, 1)
    );

    const workers = Array.from({ length: concurrency }, async () => {
        while (index < boardIds.length) {
            const boardId = boardIds[index];
            index += 1;
            const pins = await fetchPinsForBoard(accessToken, boardId, pageSize);
            allPins.push(...pins);
        }
    });

    await Promise.all(workers);
    return allPins;
};

const fetchAllBoards = async (accessToken) => {
    const boards = [];
    let bookmark = null;

    do {
        const url = new URL(`${PINTEREST_API_BASE}/boards`);
        url.searchParams.set("page_size", String(DEFAULT_PAGE_SIZE));
        if (bookmark) {
            url.searchParams.set("bookmark", bookmark);
        }
        const payload = await requestPinterest(url.toString(), accessToken);
        boards.push(...extractItems(payload));
        bookmark = payload?.bookmark ?? null;
    } while (bookmark);

    return boards;
};

const fetchPinsForBoard = async (accessToken, boardId, pageSize) => {
    const pins = [];
    let bookmark = null;

    do {
        const url = new URL(
            `${PINTEREST_API_BASE}/boards/${encodeURIComponent(boardId)}/pins`
        );
        url.searchParams.set("page_size", String(pageSize));
        if (bookmark) {
            url.searchParams.set("bookmark", bookmark);
        }
        const payload = await requestPinterest(url.toString(), accessToken);
        pins.push(...extractItems(payload));
        bookmark = payload?.bookmark ?? null;
    } while (bookmark);

    return pins;
};

const pickBestImage = (pin) => {
    const images = Object.values(pin?.media?.images ?? {});
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

export const mapPinterestPin = (pin) => {
    const image = pickBestImage(pin);
    const id =
        pin?.id === null || pin?.id === undefined
            ? ""
            : String(pin.id).trim();
    const link =
        pin?.url ?? (id ? `https://www.pinterest.com/pin/${id}/` : null);
    const destination = pin?.link ?? null;

    if (!id || !image || !link) {
        return null;
    }

    const createdAt =
        pin?.created_at ??
        pin?.createdAt ??
        pin?.created_time ??
        pin?.createdTime ??
        null;

    return {
        id,
        image,
        title: pin?.title ?? pin?.alt_text ?? "Untitled",
        description: pin?.description ?? "",
        link,
        destination,
        createdAt
    };
};

export const fetchAllPinterestPinsRaw = async ({
    accessToken,
    pageSize
} = {}) => {
    if (!accessToken) {
        throw new Error("Missing Pinterest access token.");
    }

    const size = pageSize && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
    const boards = await fetchAllBoards(accessToken);
    const boardIds = boards.map((board) => board?.id).filter(Boolean);

    return fetchPinsForBoards({ accessToken, boardIds, pageSize: size });
};

export const fetchAllPinterestPins = async ({
    accessToken,
    pageSize
} = {}) => {
    const rawPins = await fetchAllPinterestPinsRaw({ accessToken, pageSize });
    return { pins: mapPinterestPins(rawPins) };
};

export const mapPinterestPins = (rawPins = []) => {
    const deduped = new Map();
    for (const pin of rawPins) {
        const mapped = mapPinterestPin(pin);
        if (!mapped) {
            continue;
        }
        if (deduped.has(mapped.id)) {
            continue;
        }
        deduped.set(mapped.id, mapped);
    }

    return Array.from(deduped.values());
};
