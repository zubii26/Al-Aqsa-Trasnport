# Agency PWA Expansion - Implementation Walkthrough

This document outlines the features and changes implemented to expand the Agency PWA for Al Aqsa Umrah Transport.

## 1. Core Features Implemented

### Bulk Booking System
- **Purpose**: Allows agencies to book multiple vehicles in a single transaction.
- **Location**: `Agency Portal > Bulk Booking`
- **Frontend**: `src/app/agency/bulk-booking/page.tsx` - Dynamic form for adding multiple vehicle types.
- **Backend**: `src/app/api/agency/bookings/bulk/route.ts` - Handles credit checks, group ID generation, and transaction logging.
- **Notification**: Instant Push Notification sent to Agency upon success.

### Financial Management
- **Wallet System**: 
  - **View**: `src/app/agency/wallet/page.tsx` - Displays Balance (Credit/Debt), Credit Limit, and Available Credit.
  - **Top-up**: Setup logic to request credit top-ups (`/api/agency/wallet/topup`).
- **Invoices**:
  - **List**: `src/app/agency/invoices/page.tsx` - Comprehensive list of bookings and their payment status.
  - **Detail & Print**: `src/app/agency/invoices/[id]/page.tsx` - Professional, dual-language (English/Arabic) invoice view with Print and PDF Download options.
  - **PDF Generation**: `src/services/InvoiceGenerator.ts` - Client-side PDF generation using `jspdf`.

### Agency Dashboard & Analytics
- **Location**: `src/app/agency/dashboard/page.tsx`
- **New Charts**:
  - **Spending Trends**: Area chart showing monthly spending.
  - **Booking Status**: Pie chart of booking statuses.
  - **Route Popularity**: Bar chart of top routes.
- **Integration**: Real-time stats from the `Booking` and `User` models.

## 2. Technical Changes

### Database Models (`src/models/index.ts`)
- **Booking**: Added `groupId` (for bulk tracking) and `isBulk`.
- **User**: Added `branding` (logo/color) and `paymentTerms`.
- **AgencyWallet**: Refined schema to track `balance` and `creditLimit`.
- **Invoice**: Created schema for future automated invoice generation.

### Mobile & PWA
- **Navigation**: Updated Sidebar and Bottom Nav to include "Bulk Booking".
- **Push Notifications**:
  - `public/agency-sw.js`: Service Worker handling push events.
  - `src/lib/notifications.ts`: Server-side triggers using `web-push`.

## 3. Verification & Testing

### How to Verify
1.  **Bulk Booking**:
    - Go to `/agency/bulk-booking`.
    - Select Route, Date, Time.
    - Add "GMC Yukon" (qty: 2) and "Bus" (qty: 1).
    - Submit.
    - Verify redirection to Bookings list and check for Push Notification (if allowed).
2.  **Wallet**:
    - Go to `/agency/wallet`.
    - Check "Available Credit" matches `Credit Limit - Balance`.
    - Try "Request Top-up".
3.  **Invoice**:
    - Go to `/agency/invoices`.
    - Click "View" on any booking.
    - Verify Dual-language layout.
    - Click "Print" (opens browser print) or "Download PDF".

### Admin Panel Integration
- **Agency Management**:
    - **View**: `src/app/admin/users/[id]/page.tsx` - Now displays Agency Financials (**Credit Limit**, **Balance**, **Payment Terms**) and Branding.
    - **API**: Updated to return `AgencyWallet` data for seamless management.

### Next Steps
- **Admin Panel**: Update Admin views to approve "Top-up Requests" and view "Agency Analytics".
- **Real Payment Gateway**: Integrate actual payment processing if "Prepaid" model is enforced.
