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

export const fetchPinterestRssPins = async (username = "kendallcore01") => {
    const url = `https://in.pinterest.com/${encodeURIComponent(username)}/feed.rss`;
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });

    if (!response.ok) {
        throw new Error(`Pinterest RSS fetch failed with status ${response.status}`);
    }

    const xml = await response.text();
    const items = xml.split("<item>").slice(1);

    const pins = [];
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        const imgMatch = item.match(/src="([^"]+)"/) || item.match(/src=&quot;([^&]+)&quot;/);
        const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const guidMatch = item.match(/<guid>([\s\S]*?)<\/guid>/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);

        const rawTitle = titleMatch ? titleMatch[1] : "";
        const title = rawTitle
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .trim();

        const link = linkMatch ? linkMatch[1].trim() : "";
        let image = imgMatch ? imgMatch[1] : "";
        if (image) {
            image = image.replace(/\/236x\//, "/1200x/");
        }

        const pubDate = pubDateMatch ? pubDateMatch[1].trim() : null;
        const guid = guidMatch ? guidMatch[1].trim() : "";
        const id = guid ? guid.split("/").filter(Boolean).pop() || String(index) : String(index);

        let description = "";
        if (descMatch) {
            description = descMatch[1]
                .replace(/&lt;[\s\S]*?&gt;/g, "")
                .replace(/<[\s\S]*?>/g, "")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .trim();
        }

        if (id && image && link) {
            pins.push({
                id,
                title: title || "Untitled",
                description,
                image,
                link,
                destination: link,
                createdAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
            });
        }
    }

    return pins;
};

export const fetchAllPinterestPinsRaw = async ({
    accessToken,
    pageSize,
    username = "kendallcore01"
} = {}) => {
    if (accessToken) {
        try {
            const size = pageSize && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
            const boards = await fetchAllBoards(accessToken);
            const boardIds = boards.map((board) => board?.id).filter(Boolean);
            const pins = await fetchPinsForBoards({ accessToken, boardIds, pageSize: size });
            if (pins.length > 0) {
                return pins;
            }
        } catch (error) {
            console.warn("Pinterest OAuth API failed, switching to Pinterest profile RSS feed:", error);
        }
    }

    // Fallback to RSS feed if access token is invalid, expired, or missing
    return fetchPinterestRssPins(username);
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
        const mapped = pin.image && pin.link ? pin : mapPinterestPin(pin);
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
