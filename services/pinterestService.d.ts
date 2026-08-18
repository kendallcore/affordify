export interface PinterestRawPin {
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
    image?: string;
    destination?: string;
    createdAt?: string;
}

export declare function fetchPinterestRssPins(
    username?: string
): Promise<PinterestRawPin[]>;

export declare function fetchAllPinterestPinsRaw(options?: {
    accessToken?: string | null;
    pageSize?: number;
    username?: string;
}): Promise<PinterestRawPin[]>;

export declare function fetchAllPinterestPins(options?: {
    accessToken?: string | null;
    pageSize?: number;
    username?: string;
}): Promise<{ pins: PinterestRawPin[] }>;

export declare function mapPinterestPin(
    pin: PinterestRawPin
): PinterestRawPin | null;

export declare function mapPinterestPins(
    rawPins?: PinterestRawPin[]
): PinterestRawPin[];
