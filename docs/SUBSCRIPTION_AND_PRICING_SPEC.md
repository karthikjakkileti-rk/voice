# Edu-Voice AI — Subscription & Pricing Specification

## 1. Database Schema & Migration Specification

To support customizable institution subscription pricing without hardcoded tiers or loss of historical integrity, the `subscriptions` entity supports both high-level currency amounts (`price_amount`) and minor sub-units (`amount_cents`), along with configurable billing cadences and resource quotas.

### SQL Safe Migration (`20260924_subscription_pricing.sql`)

```sql
-- Migration: Add configurable pricing and quota fields to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS price_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS renewal_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS voice_minutes_limit INTEGER DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS call_limit INTEGER DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS phone_numbers_limit INTEGER DEFAULT 5;

-- Non-destructive sync of price_amount from legacy amount_cents
UPDATE subscriptions 
SET price_amount = amount_cents / 100.0 
WHERE price_amount IS NULL AND amount_cents IS NOT NULL;

-- Default fallback for records without price
UPDATE subscriptions 
SET price_amount = 15000.00 
WHERE price_amount IS NULL;
```

---

## 2. Data Model & Field Mapping

| Field | Type | Description |
|---|---|---|
| `id` | `UUID` / `string` | Primary key identifier for the subscription. |
| `organization_id` | `UUID` / `string` | Foreign key referencing `organizations(id)`. |
| `plan_tier` | `'starter' \| 'pro' \| 'enterprise'` | Standard tier categorization. |
| `plan_name` | `string` | Custom institutional commercial title (e.g. `Institutional Pro`). |
| `status` | `'active' \| 'trialing' \| 'past_due' \| 'canceled'` | Operational lifecycle status. |
| `price_amount` | `number` (2 decimals) | Configured amount charged (e.g. `15000.00`). |
| `amount_cents` | `integer` | Minor unit value for payment gateway precision (`1500000`). |
| `currency` | `'INR' \| 'USD' \| 'EUR' \| 'GBP'` | Billing currency (defaults to `INR` for India market). |
| `billing_cycle` | `'monthly' \| 'quarterly' \| 'annual'` | Cadence of recurring charge. |
| `renewal_date` | `ISO-8601 string` | Scheduled date of next renewal. |
| `voice_minutes_limit`| `integer` | Quota allocation for carrier voice minutes. |
| `call_limit` | `integer` | Quota allocation for student call sessions. |
| `phone_numbers_limit`| `integer` | Quota allocation for dedicated virtual DIDs. |

---

## 3. REST API Contract

### `GET /api/v1/organizations/{organization_id}/subscription`
- **Access Role**: `Member+` (all authenticated institution members)
- **Response**: `SuccessResponse[Subscription]`

### `PATCH /api/v1/organizations/{organization_id}/subscription`
- **Access Role**: `Admin` only (strictly enforced via RBAC)
- **Request Body**:
```json
{
  "plan_tier": "pro",
  "plan_name": "Institutional Pro",
  "price_amount": 15000.00,
  "currency": "INR",
  "billing_cycle": "monthly",
  "voice_minutes_limit": 5000,
  "call_limit": 2000,
  "phone_numbers_limit": 5,
  "renewal_date": "2026-10-24T23:59:59Z"
}
```
- **Response**: `SuccessResponse[Subscription]`

---

## 4. Frontend Architecture & RBAC

1. **Service Layer (`src/services/api/index.ts` & `src/services/data-provider.ts`)**:
   - `dataProvider.getSubscription(orgId)`
   - `dataProvider.updateSubscription(orgId, payload)`
2. **Mock Store (`src/services/mock/mock-provider.ts`)**:
   - In-memory mock persistence synchronized with `SEEDED_SUBSCRIPTIONS`.
3. **React Query Hook (`src/hooks/useSubscription.ts`)**:
   - Provides `subscription`, `isLoading`, `isUpdating`, and `updateSubscription` mutation with automatic cache invalidation (`['subscription', orgId]`).
4. **Subscription Management Console (`src/app/(dashboard)/[orgSlug]/subscription/page.tsx`)**:
   - Displays real contracted rate, quotas, usage telemetry, and commercial terms breakdown.
   - Admin-only `Edit Plan & Pricing` dialog with strict numeric validation, decimal precision check, currency selection, and quota customization.
   - Non-admin roles see a read-only badge and are prevented from altering pricing.
5. **Dashboard Operational Summary Card (`src/app/(dashboard)/[orgSlug]/page.tsx`)**:
   - Compact Exotel-style status tile displaying real configured plan, dynamic currency/rate (`₹15,000 / month`), renewal date, and a direct `[ Manage Subscription ]` action link.
