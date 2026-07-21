# Food Genie — Rider Portal

An independent React (Vite) application for Food Genie delivery riders.

## Tech Stack

- React 18 + Vite 5
- React Router v6 (SPA routing)
- React Context + useReducer (state management)
- Tailwind CSS (CDN — same config as Google Stitch exports)
- Material Symbols Outlined + Inter font (Google Fonts CDN)

## Project Structure

```
rider-portal/
├── index.html              # Root HTML with Tailwind CDN + Stitch design tokens
├── vite.config.js          # Vite config, dev server on port 3002
├── package.json
├── src/
│   ├── main.jsx            # Entry — BrowserRouter + AppProvider
│   ├── App.jsx             # Route declarations
│   ├── context/
│   │   └── AppContext.jsx  # AuthContext, OrderContext, DeliveryContext
│   ├── components/
│   │   └── BottomNav.jsx   # Shared bottom navigation bar
│   └── pages/
│       ├── Dashboard.jsx        # /dashboard
│       ├── AvailableOrders.jsx  # /orders
│       ├── ActiveDelivery.jsx   # /delivery
│       └── EarningsOverview.jsx # /earnings
```

## Routes

| Path         | Page              | Source                              |
|--------------|-------------------|-------------------------------------|
| `/dashboard` | Dashboard         | Reconstructed from DESIGN.md tokens |
| `/orders`    | Available Orders  | `available_orders/code.html`        |
| `/delivery`  | Active Delivery   | `active_delivery/code.html`         |
| `/earnings`  | Earnings Overview | `earnings_overview/code.html`       |

## State Management

### AuthContext
- `rider.name`, `rider.isOnline`
- `toggleOnline()` — flip the online/offline toggle

### OrderContext (useReducer)
- `orders[]` — available orders list
- `currentOrder` — order currently being delivered
- `acceptOrder(order)` — moves order to `currentOrder`, navigates to `/delivery`
- `skipOrder(id)` — removes from the list

### DeliveryContext (useReducer)
- `deliveryStatus` — `accepted | picked_up | on_the_way | delivered`
- `advanceStatus()` — moves to next step
- `completeDelivery(order)` — updates earnings + completedOrders
- `earnings.today`, `earnings.weekly`, `earnings.monthly`
- `completedOrders[]`, `totalDeliveries`, `avgPerOrder`

## Getting Started

```bash
cd rider-portal
npm install
npm run dev
# App runs at http://localhost:3002
```

## Notes

- **Admin Portal is untouched** at `../admin-app/`
- This app is completely independent — separate `package.json`, separate dev server port
- Tailwind is loaded via CDN to guarantee pixel-perfect parity with the Stitch exports
