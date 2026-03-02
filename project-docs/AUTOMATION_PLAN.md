# Pinterest-to-Website Automation Plan

## What This Does

This automation will **eliminate manual work** by automatically syncing products from Pinterest to your website. Instead of entering product information twice (once on Pinterest, once in your JSON files), you'll only need to post to Pinterest, and your website will update automatically.

---

## How It Works (Simple Version)

```
1. You post a product pin on Pinterest
   ↓
2. Automation platform detects the new pin
   ↓
3. It extracts product info (name, price, image, link)
   ↓
4. It updates your website's JSON files
   ↓
5. Your website automatically shows the new product
```

---

## What You'll Need

### 1. Pinterest Developer Account (Free)
- Sign up at: https://developers.pinterest.com/
- Create an app to get API access
- This lets the automation read your pins

### 2. Automation Platform (Choose One)

**Option A: Make.com** ⭐ Recommended for Beginners
- **Cost:** Free for 1,000 operations/month (about 30 products)
- **Paid:** $9/month for 10,000 operations
- **Pros:** Easy visual interface, no coding needed
- **Cons:** Monthly cost if you exceed free tier
- **Website:** https://www.make.com

**Option B: n8n** ⭐ Recommended for Developers
- **Cost:** Free (you host it yourself)
- **Hosting:** $5-10/month for a small server
- **Pros:** Unlimited operations, full control
- **Cons:** Requires technical setup
- **Website:** https://n8n.io

### 3. GitHub Account (Free)
- You probably already have this
- Used to automatically update your website files

---

## Step-by-Step Setup Guide

### Phase 1: Organize Your Pinterest Boards (30 minutes)

**Why:** The automation needs to know which Pinterest board maps to which section of your website.

**What to do:**

1. Create separate Pinterest boards for each website section:
   - `Affordify - Featured Deals` → Updates `featured-deals.json`
   - `Affordify - Expert Picks` → Updates `expert-picks.json`
   - `Affordify - Comparison` → Updates `comparison.json`

2. Move your existing pins to the correct boards

3. Write down the board names - you'll need them later

---

### Phase 2: Create a Pin Template (15 minutes)

**Why:** The automation needs to extract structured data from your pins. Using a consistent format makes this reliable.

**Pin Description Format:**

```
Product Name | Brand Name
$XXX (was $YYY) ⭐ 4.5/5 (1240 reviews)

Short description of the product highlighting key features and benefits.

#affordify #deals #tech
EDITOR_CHOICE: true
```

**Example:**

```
Apple Watch Ultra 2 | Apple
$799 (was $849) ⭐ 4.9/5 (1240 reviews)

The most rugged and capable Apple Watch ever, designed for athletes and adventurers.

#affordify #smartwatch #tech
EDITOR_CHOICE: true
```

**What each part means:**
- **Line 1:** Product name and brand (separated by `|`)
- **Line 2:** Current price, original price (optional), rating, review count
- **Line 3+:** Description text
- **Hashtags:** Help categorize products
- **Custom fields:** `EDITOR_CHOICE: true` or `EDITOR_CHOICE: false`

**Important:** 
- Always use this exact format
- The automation will parse this to fill your JSON files
- If you skip a field, it won't appear on your website

---

### Phase 3: Get Pinterest API Access (30 minutes)

**Step-by-step:**

1. Go to https://developers.pinterest.com/
2. Click "Get Started" and log in with your Pinterest account
3. Click "Create App"
4. Fill in the form:
   - **App name:** Affordify Automation
   - **App description:** Automatically sync pins to website
   - **Website:** https://affordify.com (your website URL)
5. Click "Create"
6. You'll get:
   - **App ID:** (a long number)
   - **App Secret:** (a long string - keep this private!)
7. Save these somewhere safe - you'll need them next

**Set up OAuth:**
1. In your app settings, add a redirect URL: `https://oauth.pstmn.io/v1/callback`
2. Click "Save"
3. Note your **Access Token** (you may need to generate one)

---

### Phase 4: Set Up Automation (Make.com Example)

**Time:** 1-2 hours

#### 4.1 Create Make.com Account
1. Go to https://www.make.com
2. Sign up (free account is fine to start)
3. Verify your email

#### 4.2 Connect Pinterest
1. In Make.com, go to "Connections"
2. Click "Add" → Search for "Pinterest"
3. Enter your Pinterest API credentials (from Phase 3)
4. Test the connection

#### 4.3 Connect GitHub
1. In "Connections", click "Add" → Search for "GitHub"
2. Authorize Make.com to access your repository
3. Select the Affordify repository

#### 4.4 Create Your First Automation Scenario

**Scenario Name:** Pinterest to Featured Deals

**Module 1: Watch Pinterest Board**
- **Trigger:** Pinterest → Watch Pins
- **Board:** Select "Affordify - Featured Deals"
- **Schedule:** Every 15 minutes

**Module 2: Parse Pin Description**
- **Tool:** Text Parser → Match Pattern
- **Pattern for price:** `\$([0-9,]+)`
- **Pattern for rating:** `⭐ ([0-9.]+)/5`
- **Pattern for reviews:** `\(([0-9,]+) reviews\)`
- **Extract:** Product name (before `|`), Brand (after `|`)

**Module 3: Check for Duplicates**
- **Tool:** GitHub → Get File Content
- **File:** `src/data/featured-deals.json`
- **Check:** If Pin ID already exists in the JSON

**Module 4: Build Product Object**
- **Tool:** Tools → Set Variable
- **Create JSON:**
```json
{
  "id": "{{pinterest.pin.id}}",
  "name": "{{parsed.product_name}}",
  "brand": "{{parsed.brand}}",
  "description": "{{parsed.description}}",
  "price": "${{parsed.price}}",
  "originalPrice": "${{parsed.original_price}}",
  "rating": {{parsed.rating}},
  "reviews": {{parsed.reviews}},
  "image": "{{pinterest.pin.image_url}}",
  "isEditorChoice": {{parsed.editor_choice}},
  "affiliateLink": "{{pinterest.pin.link}}"
}
```

**Module 5: Update JSON File**
- **Tool:** GitHub → Create or Update File
- **File:** `src/data/featured-deals.json`
- **Content:** Append new product to existing array
- **Commit message:** `[AUTO] Add product: {{product_name}}`

**Module 6: Send Notification**
- **Tool:** Email or Slack
- **Message:** "New product added: {{product_name}}"

#### 4.5 Test Your Automation
1. Create a test pin on Pinterest using your template
2. Wait 15 minutes (or run the scenario manually)
3. Check if `featured-deals.json` updated
4. Check if your website shows the new product

---

### Phase 5: Add Safety Checks (Important!)

**Why:** Prevent broken data from appearing on your website.

#### 5.1 Add Data Validation

Create a new file: `src/utils/validateProduct.ts`

```typescript
/**
 * Validates that a product has all required fields
 * Returns true if valid, false if missing critical data
 */
export function validateProduct(product: any): boolean {
  // Check required fields exist and are not empty
  const hasRequiredFields = !!(
    product.id &&
    product.name &&
    product.price &&
    product.image &&
    product.affiliateLink
  );

  // Check price format
  const validPrice = product.price && product.price.startsWith('$');

  // Check rating range
  const validRating = product.rating >= 0 && product.rating <= 5;

  // Check affiliate link is Amazon
  const validLink = product.affiliateLink && 
    (product.affiliateLink.includes('amazon.com') || 
     product.affiliateLink.includes('amzn.to'));

  return hasRequiredFields && validPrice && validRating && validLink;
}
```

#### 5.2 Update Components to Use Validation

Edit `src/components/sections/FeaturedDeals.tsx`:

```typescript
import ProductCard from "../ui/ProductCard";
import DEALS from "@/data/featured-deals.json";
import { validateProduct } from "@/utils/validateProduct";

export default function FeaturedDeals() {
    // Filter out any invalid products
    const validDeals = DEALS.filter(validateProduct);

    return (
        <section className="py-20 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ... existing code ... */}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {validDeals.map((deal) => (
                        <ProductCard key={deal.id} {...deal} />
                    ))}
                </div>
            </div>
        </section>
    );
}
```

Do the same for `ExpertPicks.tsx` and `ComparisonTable.tsx`.

---

## Common Issues & Solutions

### Issue 1: Pin Not Appearing on Website

**Possible causes:**
1. Pin description doesn't match template format
2. Automation hasn't run yet (wait 15 minutes)
3. Validation failed (missing required field)

**How to fix:**
1. Check Make.com execution history for errors
2. Verify pin description matches template exactly
3. Check GitHub commits - was the file updated?
4. Look at browser console for validation errors

---

### Issue 2: Duplicate Products

**Cause:** Same product posted twice

**How to fix:**
- The automation uses Pin ID as the product ID
- If you post the same product twice, you'll get two entries
- **Solution:** Delete the duplicate pin on Pinterest, then manually remove from JSON

**Prevention:**
- Before posting, search your board to see if product exists
- Use Pinterest's built-in duplicate detection

---

### Issue 3: Wrong Price or Rating

**Cause:** Typo in pin description

**How to fix:**
1. Edit the pin description on Pinterest
2. Wait for automation to run (15 minutes)
3. It should update the JSON file automatically

---

### Issue 4: Image Not Showing

**Possible causes:**
1. Pinterest image URL is broken
2. Image was deleted
3. URL format changed

**How to fix:**
- Add image validation to automation
- Check that image URL is accessible
- Re-upload image to Pinterest if needed

---

## Maintenance Tasks

### Daily (5 minutes)
- Check email/Slack for automation error notifications
- Quick visual check that new products are appearing

### Weekly (15 minutes)
- Review Make.com execution history
- Check for any failed operations
- Verify website and Pinterest are in sync

### Monthly (1 hour)
- Review all products for accuracy
- Clean up any duplicates
- Update pin template if needed
- Check Pinterest API usage (stay under limits)

---

## Scaling Up

### When You Outgrow Free Tier

**Signs you need to upgrade:**
- Posting more than 30 products/month
- Make.com shows "operation limit reached"

**Options:**
1. **Upgrade Make.com:** $9/month for 10,000 operations
2. **Switch to n8n:** Free but requires server ($5-10/month)
3. **Optimize automation:** Run less frequently (every hour instead of 15 min)

### Moving to a Database (Future)

If you grow to 500+ products, consider:
- Moving from JSON files to PostgreSQL database
- Using Prisma ORM for data management
- This plan makes migration easy (same data structure)

---

## Cost Breakdown

| Item | Free Option | Paid Option |
|------|-------------|-------------|
| Pinterest API | ✅ Free | ✅ Free |
| Make.com | ✅ Free (1K ops) | $9-29/month |
| n8n | N/A | $5-10/month (server) |
| GitHub | ✅ Free | ✅ Free |
| Vercel Hosting | ✅ Free | ✅ Free |
| **Total** | **$0/month** | **$9-29/month** |

**Recommendation:** Start with free tier, upgrade when needed.

---

## Next Steps

1. ✅ Read this plan
2. ⬜ Choose automation platform (Make.com or n8n)
3. ⬜ Set up Pinterest boards
4. ⬜ Get Pinterest API access
5. ⬜ Create first automation scenario
6. ⬜ Test with 3-5 products
7. ⬜ Add validation code
8. ⬜ Roll out to all boards
9. ⬜ Monitor for one week
10. ⬜ Document any custom adjustments

---

## Questions?

If you get stuck, check:
1. Make.com documentation: https://www.make.com/en/help
2. Pinterest API docs: https://developers.pinterest.com/docs/
3. This project's `TROUBLESHOOTING.md` (coming next)

---

*This automation will save you hours every week. The initial setup takes 2-3 hours, but then it runs on autopilot!*
