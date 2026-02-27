#!/usr/bin/env python3
"""
Affodify Backend (Flask + SQLite)

Dependencies (install):
  pip install flask requests paapi5-python-sdk python-dotenv

Setup instructions:
1) Get Pinterest access token:
   - Create a Pinterest App in the Pinterest Developers portal.
   - Use OAuth to obtain a Bearer access token with read permissions.
   - Save it in .env as PINTEREST_ACCESS_TOKEN.
   - Identify your Board ID (from the board URL or API) and set PINTEREST_BOARD_ID.

2) Get Amazon PA-API credentials:
   - Sign up for Amazon Associates and enable Product Advertising API.
   - Create access keys in the Amazon Associates portal.
   - Set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG, AMAZON_COUNTRY.

3) Create a .env file in the project root:
   PINTEREST_ACCESS_TOKEN=your_pinterest_bearer_token
   PINTEREST_BOARD_ID=your_board_id
   AMAZON_ACCESS_KEY=your_amazon_access_key
   AMAZON_SECRET_KEY=your_amazon_secret_key
   AMAZON_ASSOCIATE_TAG=affodify-21
   AMAZON_COUNTRY=IN
   AFFILIATE_TAG=affodify-21
   FLASK_PORT=5000

4) Run the server:
   python app.py

Frontend integration note:
  fetch('/api/products').then(res => res.json()).then(data => {
    // loop and display cards with <a href={item.link}>Buy on Amazon</a>
  })
"""

import logging
import os
import re
import sqlite3
from datetime import datetime, timezone
from typing import Dict, List, Optional

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify

try:
    from paapi5_python_sdk.api.default_api import DefaultApi
    from paapi5_python_sdk.models.get_items_request import GetItemsRequest
    from paapi5_python_sdk.models.get_items_resource import GetItemsResource
    from paapi5_python_sdk.partner_type import PartnerType
    from paapi5_python_sdk.api_client import ApiClient
    from paapi5_python_sdk.configuration import Configuration
except Exception:  # pragma: no cover - optional import
    DefaultApi = None  # type: ignore


load_dotenv()

APP_NAME = "Affodify"
DB_PATH = os.getenv("DB_PATH", "affodify.db")

PINTEREST_ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN", "YOUR_PINTEREST_ACCESS_TOKEN")
PINTEREST_BOARD_ID = os.getenv("PINTEREST_BOARD_ID", "YOUR_PINTEREST_BOARD_ID")

AMAZON_ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY", "YOUR_AMAZON_ACCESS_KEY")
AMAZON_SECRET_KEY = os.getenv("AMAZON_SECRET_KEY", "YOUR_AMAZON_SECRET_KEY")
AMAZON_ASSOCIATE_TAG = os.getenv("AMAZON_ASSOCIATE_TAG", "affodify-21")
AMAZON_COUNTRY = os.getenv("AMAZON_COUNTRY", "IN")

# Fallback affiliate tag if provided separately
AFFILIATE_TAG = os.getenv("AFFILIATE_TAG", AMAZON_ASSOCIATE_TAG)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(APP_NAME)

app = Flask(__name__)


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                pin_id TEXT PRIMARY KEY,
                title TEXT,
                description TEXT,
                image_url TEXT,
                amazon_asin TEXT,
                affiliate_link TEXT,
                price TEXT,
                last_updated TEXT
            )
            """
        )
        conn.commit()


def extract_asin(url: str) -> Optional[str]:
    if not url:
        return None
    patterns = [
        r"/dp/([A-Z0-9]{10})",
        r"/gp/product/([A-Z0-9]{10})",
        r"/product/([A-Z0-9]{10})",
        r"/ASIN/([A-Z0-9]{10})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def build_affiliate_link(asin: str) -> str:
    return f"https://www.amazon.in/dp/{asin}?tag={AFFILIATE_TAG}-21"


def fetch_pinterest_pins() -> List[Dict]:
    if PINTEREST_ACCESS_TOKEN.startswith("YOUR_"):
        logger.warning("Pinterest access token not set.")
        return []

    url = f"https://api.pinterest.com/v5/boards/{PINTEREST_BOARD_ID}/pins"
    headers = {"Authorization": f"Bearer {PINTEREST_ACCESS_TOKEN}"}
    params = {"page_size": 100}

    pins: List[Dict] = []
    while True:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code != 200:
            logger.error("Pinterest API error: %s | %s", resp.status_code, resp.text)
            break
        data = resp.json()
        pins.extend(data.get("items", []))
        bookmark = data.get("bookmark")
        if not bookmark:
            break
        params["bookmark"] = bookmark

    return pins


def get_paapi_client() -> Optional[DefaultApi]:
    if DefaultApi is None:
        logger.warning("PA-API SDK not installed or failed to import.")
        return None
    if AMAZON_ACCESS_KEY.startswith("YOUR_") or AMAZON_SECRET_KEY.startswith("YOUR_"):
        logger.warning("Amazon PA-API credentials not set.")
        return None

    config = Configuration(
        access_key=AMAZON_ACCESS_KEY,
        secret_key=AMAZON_SECRET_KEY,
        host="webservices.amazon.in",
        region="us-east-1",
    )
    api_client = ApiClient(config)
    return DefaultApi(api_client)


def fetch_amazon_product_details(asin: str) -> Dict:
    # Fallback data if API is not configured or fails
    details = {
        "title": None,
        "price": None,
        "image_url": None,
    }

    client = get_paapi_client()
    if not client:
        return details

    try:
        resources = [
            GetItemsResource.ITEMINFO_TITLE,
            GetItemsResource.OFFERS_LISTINGS_PRICE,
            GetItemsResource.IMAGES_PRIMARY_LARGE,
        ]

        request = GetItemsRequest(
            partner_tag=AMAZON_ASSOCIATE_TAG,
            partner_type=PartnerType.ASSOCIATES,
            marketplace=f"www.amazon.{AMAZON_COUNTRY.lower()}",
            item_ids=[asin],
            resources=resources,
        )

        response = client.get_items(request)
        if response.items_result and response.items_result.items:
            item = response.items_result.items[0]
            if item.item_info and item.item_info.title:
                details["title"] = item.item_info.title.display_value
            if item.offers and item.offers.listings:
                listing = item.offers.listings[0]
                if listing.price and listing.price.display_amount:
                    details["price"] = listing.price.display_amount
            if item.images and item.images.primary and item.images.primary.large:
                details["image_url"] = item.images.primary.large.url
    except Exception as exc:  # pragma: no cover - API errors are logged
        logger.exception("Amazon PA-API error for ASIN %s: %s", asin, exc)

    return details


def sync_pins_to_db() -> Dict:
    pins = fetch_pinterest_pins()
    synced = 0
    skipped = 0

    with get_db_connection() as conn:
        for pin in pins:
            pin_id = pin.get("id")
            if not pin_id:
                skipped += 1
                continue

            link = pin.get("link") or ""
            asin = extract_asin(link)
            if not asin:
                skipped += 1
                continue

            pin_title = pin.get("title") or ""
            pin_description = pin.get("description") or ""
            image_url = ""
            media = pin.get("media")
            if isinstance(media, dict):
                images = media.get("images") or {}
                if isinstance(images, dict):
                    original = images.get("original")
                    if isinstance(original, dict):
                        image_url = original.get("url") or ""

            api_details = fetch_amazon_product_details(asin)
            title = api_details.get("title") or pin_title
            price = api_details.get("price")
            image = api_details.get("image_url") or image_url

            affiliate_link = build_affiliate_link(asin)
            last_updated = datetime.now(timezone.utc).isoformat()

            conn.execute(
                """
                INSERT INTO products (
                    pin_id, title, description, image_url,
                    amazon_asin, affiliate_link, price, last_updated
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(pin_id) DO UPDATE SET
                    title=excluded.title,
                    description=excluded.description,
                    image_url=excluded.image_url,
                    amazon_asin=excluded.amazon_asin,
                    affiliate_link=excluded.affiliate_link,
                    price=excluded.price,
                    last_updated=excluded.last_updated
                """,
                (
                    pin_id,
                    title,
                    pin_description,
                    image,
                    asin,
                    affiliate_link,
                    price,
                    last_updated,
                ),
            )
            synced += 1

        conn.commit()

    return {"synced": synced, "skipped": skipped, "total": len(pins)}


@app.route("/api/products", methods=["GET"])
def api_products():
    with get_db_connection() as conn:
        rows = conn.execute(
            """
            SELECT title, description, image_url, affiliate_link, price
            FROM products
            ORDER BY last_updated DESC
            """
        ).fetchall()

    products = []
    for row in rows:
        products.append(
            {
                "title": row["title"],
                "image": row["image_url"],
                "link": row["affiliate_link"],
                "price": row["price"],
                "description": row["description"],
            }
        )

    return jsonify(products)


@app.route("/api/sync", methods=["GET"])
def api_sync():
    result = sync_pins_to_db()
    return jsonify({"status": "ok", **result})


def startup_sync() -> None:
    try:
        result = sync_pins_to_db()
        logger.info("Startup sync complete: %s", result)
    except Exception:
        logger.exception("Startup sync failed")


if __name__ == "__main__":
    init_db()
    startup_sync()
    port = int(os.getenv("FLASK_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
