import type { PinterestRawPin } from "@/lib/pinterestDeals";

const PINTEREST_API_BASE = "https://api.pinterest.com/v5";
const DEFAULT_PAGE_SIZE = 24;

type PinterestApiResponse = {
    items?: PinterestRawPin[];
    data?: PinterestRawPin[];
};

export const fetchPinterestPins = async ({
    accessToken,
    boardId,
    pageSize
}: {
    accessToken: string;
    boardId?: string | null;
    pageSize?: number;
}): Promise<PinterestRawPin[]> => {
    const size = pageSize && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
    const url = boardId
        ? `${PINTEREST_API_BASE}/boards/${encodeURIComponent(
              boardId
          )}/pins?page_size=${size}`
        : `${PINTEREST_API_BASE}/pins?page_size=${size}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const body = await response.text();
        console.error("Pinterest API request failed", {
            status: response.status,
            body
        });
        if (response.status === 401 || response.status === 403) {
            console.error("Pinterest access token appears invalid or expired.");
        }
        throw new Error(
            `Pinterest API error (${response.status}): ${body}`
        );
    }

    const json = (await response.json()) as PinterestApiResponse;
    return json.items ?? json.data ?? [];
};

export const fetchPinsWithFallback = async ({
    accessToken,
    fallbackBoardId,
    pageSize
}: {
    accessToken: string;
    fallbackBoardId?: string | null;
    pageSize?: number;
}): Promise<PinterestRawPin[]> => {
    const primaryPins = await fetchPinterestPins({
        accessToken,
        boardId: null,
        pageSize
    });
    if (primaryPins.length > 0 || !fallbackBoardId) {
        return primaryPins;
    }
    console.warn("No pins returned, falling back to board pins.");
    return fetchPinterestPins({
        accessToken,
        boardId: fallbackBoardId,
        pageSize
    });
};
