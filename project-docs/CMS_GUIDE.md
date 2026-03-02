# Affordify CMS Guide

Welcome to your affiliate product management system! This site is now driven by JSON data files, allowing you to update products and affiliate links without changing any code.

## Data Files

You can find the product data in the `src/data/` directory:

1.  **Featured Deals**: `src/data/featured-deals.json` - Controls the "Featured Smart Deals" section grid.
2.  **Expert's Choice**: `src/data/expert-picks.json` - Controls the large featured product section.
3.  **Comparison Table**: `src/data/comparison.json` - Controls the comparison table items.

---

## How to Add/Edit Products

### 1. Locate the correct JSON file
Decide which section you want to update and open the corresponding file in `src/data/`.

### 2. Add or Modify an Entry
Each product is represented as an object in the JSON array (except for `expert-picks.json` which is a single object).

#### Example Product Entry (Featured Deals)
```json
{
    "id": "new-product-id",
    "name": "Product Name",
    "brand": "Brand Name",
    "description": "Short description of the product.",
    "price": "$XXX",
    "originalPrice": "$YYY", (Optional)
    "rating": 4.5,
    "reviews": 100,
    "image": "URL to product image",
    "isEditorChoice": true, (Optional)
    "affiliateLink": "https://your-affiliate-link.com"
}
```

### 3. Save and Refresh
Once you save the JSON file, the website will automatically update with the new information.

---

## Tips for Success

- **Images**: Use high-quality Unsplash links or host your own images and provide the full URL.
- **Affiliate Links**: Always double-check your affiliate links to ensure they work correctly.
- **JSON Syntax**: Ensure your JSON is valid (proper commas, quotes, etc.). If you make a mistake, the site might not load correctly until fixed.
