# 🧱 Chess App — Project Documentation

Full documentation for the Chess App full-stack project. The frontend (this repo) adds a digital-content store on top of the backend (`D:\chess server\server`).

---

## 1. Project Overview

**Chess App** is a real-time chess app with a digital-content store. Users can play chess locally, against the computer, or online with another player, and also **buy PDF and course products** with **Khalti** (Nepal's payment gateway), earn entitlements, and **download PDFs**.

The backend (`D:\chess server\server`) is a Node.js + Express + Socket.io server with:

- User registration, email verification, JWT auth + refresh rotation
- Real-time matchmaking and game sessions over WebSockets
- A product catalog (PDF/Course), order creation with idempotency keys
- Khalti payment initiation, server-side verification, entitlement grants
- Supabase Storage for private PDF downloads (entitlement-gated)

This frontend repo consumes those APIs and adds the UI for the store:
**browse → buy → verify → download**, plus **admin product & PDF management**.

---

## 2. Tech Stack

### Frontend (this repo)
| Layer | Technology |
|---|---|
| Runtime | Node.js (Expo SDK 57) |
| App framework | Expo Router (file-based routing) |
| UI | React Native + NativeWind (Tailwind) |
| State / forms | React Hook Form + Zod + @hookform/resolvers |
| Storage | expo-secure-store (tokens) |
| Real-time | socket.io-client (WebSockets) |
| Payments | Khalti via `expo-web-browser` |

### Backend (`D:\chess server\server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM / TypeScript) |
| Web framework | Express 5 |
| Real-time | Socket.io 4.x |
| Database | PostgreSQL (Neon) via Prisma ORM |
| File storage | Supabase Storage |
| Email | Resend |
| Validation | Zod |
| Payments | Khalti ePayment API v2 |
| Dev server | tsx |

---

## 3. Project Structure

### Frontend (`chess-app/`)
```
app/
├── (auth)/login.tsx, register.tsx, verify-email.tsx
├── home.tsx                     # games menu (2P, computer, online) + Store
├── game.tsx                     # local / computer / online game router
├── store/                       # 🛒 store
├── store/[id]/                  #   product detail
├── store/[id]/buy/              #   buy flow
├── payment/success.tsx, failure.tsx   #   payment results
├── library.tsx                  #   my library
├── admin/products.tsx, create.tsx, [id]/upload   #   admin (sell)
└── ...

src/
├── features/
│   ├── auth/ ...               # auth domain + UI + session
│   ├── chess/ ...              # chess engine, online matchmaking, sockets
│   └── store/ ...              # 🛒 store domain (see below)
├── shared/api/apiClient.ts     # base URL, auth headers, 401 retry
└── app/                        # root expo-router layout
```

`features/store` domain-driven layout:

```
src/features/store/
├── domain/
│   ├── repositories/StoreRepository.ts   # interface + domain types
│   ├── schemas/orderSchema.ts, productSchema.ts
│   └── useCases/                      # GetProducts, GetProductById, CreateOrder,
│       ├── GetProductsUseCase.ts        # InitiateKhaltiPayment, VerifyKhaltiPayment,
│       ├── GetProductByIdUseCase.ts     # CreateProduct, UploadProductPdf,
│       ├── CreateOrderUseCase.ts        # GetMyEntitlements, DownloadProductPdf
│       ├── InitiateKhaltiPaymentUseCase.ts
│       ├── VerifyKhaltiPaymentUseCase.ts
│       ├── CreateProductUseCase.ts
│       ├── UploadProductPdfUseCase.ts
│       ├── GetMyEntitlementsUseCase.ts
│       └── DownloadProductPdfUseCase.ts
├── infrastructure/api/
│   ├── storeApi.ts                    # HTTP layer + defensive response parsers
│   └── StoreRepositoryImpl.ts
├── presentation/
│   ├── viewModels/ ...                # useProducts, useProduct, useBuy, useLibrary,
│   │                                  #   useCreateProduct, useUploadPdf
│   └── components/ProductCard.tsx
└── di/storeFactory.ts                 # DI + export all use cases
```

### Backend (`D:\chess server\server/`)
```
server/
├── prisma/                    # schema + migrations
├── src/
│   ├── domain/payments/PaymentGateway.ts
│   ├── application/useCases/ ...        # create order, products, khalti initiate/verify
│   ├── infrastructure/
│   │   ├── database/prisma.ts
│   │   ├── payments/khalti/ ...         # Khalti gateway + types
│   │   ├── realtime/ ...                 # socket.io stores & handlers
│   │   └── storage/supabaseStorage.ts
│   ├── modules/payments/paymentDependencies.ts
│   └── presentation/http/ ...            # auth/order/payment/product/pdf routes + JWT middleware
└── prisma/seed-payment-test.ts
```

---

## 4. Domain Model

### Enums
| Enum | Values |
|---|---|
| `UserRole` | `USER`, `ADMIN` |
| `ContentType` | `PDF`, `COURSE` |
| `ProductStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `PaymentProvider` | `STRIPE`, `ESEWA`, `KHALTI` |
| `OrderStatus` | `PENDING`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED` |
| `PaymentStatus` | `INITIATED`, `PENDING`, `SUCCEEDED`, `FAILED`, `REFUNDED` |

### Core models (Prisma)
- **User** — email (unique), username (unique), passwordHash, role, emailVerifiedAt
- **ContentProduct** — title, slug (unique), description, type (PDF/COURSE), status, priceMinor, currency, coverKey
- **ContentAsset** — storageKey, fileName, mimeType, sizeBytes, version, isPreview
- **Order** — userId, productId, amountMinor, currency, status, idempotencyKey
- **Payment** — orderId, provider, status, providerOrderId, providerTransactionId
- **Entitlement** — userId, productId, orderId (unique on user+product)
- **PaymentWebhookEvent** — provider, eventId, eventType

## 5. Khalti Payment System

Khalti is Nepal's dominant payment gateway. The server integrates with Khalti's **ePayment API v2**.

```
Client                                          Server (backends)             Khalti
  │                                                 │                             │
  │ 1. POST /orders {productId, idempotencyKey}    │                             │
  │------------------------------------------>                              │
  │                                                 │  → creates Order (PENDING)  │
  │                                                 │                             │
  │ 2. POST /payments/khalti/initiate {orderId}    │                             │
  │------------------------------------------>                              │
  │                                                 │  → Payment (INITIATED)      │
  │                                                 │  → POST Khalti /epayment/   │
  │                                                 │     initiate → paymentUrl   │
  │                                                 │  → returns { pidx, paymentUrl }
  │                                                 │                             │
  │ 3. open paymentUrl (web browser)                                    │
  │                                                                 Public payment page
  │                                                                 (Khalti sandbox)
  │ 4. user completes payment, Khalti redirects                    │
  │    GET /payments/khalti/return?pidx=…                          │
  │                                                 │  → POST /epayment/lookup/   │
  │                                                 │     (server-side verify)    │
  │                                                 │  → Order PAID + Payment      │
  │                                                 │     SUCCEEDED + Entitlement│
  │ 5. redirect to APP_WEBSITE_URL/payment/success?orderId=…       │
  │                                                 │                             │
```

**Key design decisions**
- Prices are in **minor units** (paisa); Khalti expects paisa.
- **Server-side verification** — the client-reported status is never trusted.
- **Idempotent entitlements** — upsert guarantees one entitlement per user+product.
- A `Payment` row is created (`INITIATED`) before contacting Khalti, so failed attempts are recorded.

---

## 6. Store / Buy-Sell Feature (frontend)

### Browse
- `GET /products` — list of published products (pagination + search). Shape: `{ products, page, limit, total }` (also tolerates `{ data }` and bare arrays).
- `GET /products/:id` — product detail.

### Buy (client-side)
1. Tap **Buy Now** → `POST /orders` with `productId` + generated `idempotencyKey`.
2. `POST /payments/khalti/initiate` → `{ pidx, paymentUrl }`.
3. Open `paymentUrl` in `expo-web-browser`. User pays on Khalti.
4. Tap **Verify Payment** → `POST /payments/khalti/verify` with `pidx`.
5. On success: order → `PAID`, entitlement granted, PDF unlocks in the Library.

### Download
- `GET /products/:id/pdf/download` (requires paid entitlement) → Supabase signed URL (120 s expiry) → opened in the browser.

### Admin (sell)
- `POST /products` (admin) — create a draft PDF/Course product.
- `POST /products/:id/pdf` (admin) — upload the PDF file (multipart `pdf`, max 20 MB).
- Products appear in `/store` once published.

> Endpoint assumptions are documented in `STORE_FRONTEND_ASSUMPTIONS.md` at the repo root (e.g. `GET /entitlements` for the library, `data` wrappers, Khalti mobile flow).

---

## 7. API Reference (server)

See `D:\chess server\server\DOCUMENTATION.md` §5 (API Reference) for the full route table:

- `/auth/*` — register, verify-email, login, refresh, logout
- `/orders` — create (idempotencyKey required)
- `/payments/khalti/initiate` — { orderId }
- `/payments/khalti/verify` — { pidx }
- `/payments/khalti/return?pidx=` — return URL
- `/products`, `/products/:id`, `/products` (admin), PDF upload + downloads


## 8. Environment Variables

### Backend
Copy `server/.env.example` → `server/.env`:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL_UNPOOLED=...
NEON_BRANCH=production
RESEND_API_KEY=re_...
EMAIL_FROM="Chess App <noreply@yourdomain.com>"
JWT_SECRET=<random>
PORT=3000
KHALTI_SECRET_KEY=test_secret_key_...
KHALTI_BASE_URL=https://dev.khalti.com/api/v2
KHALTI_RETURN_URL=https://yourdomain.com/payments/khalti/return
APP_WEBSITE_URL=https://yourdomain.com
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=chess-pdfs
```

### Frontend
No runtime `.env` — the base URL lives in `src/shared/api/apiClient.ts`. To support multiple environments, expose `EXPO_PUBLIC_API_BASE_URL` in `app.json` or `env`.

---

## 9. Setup & Installation

### Prerequisites
- Node.js (LTS)
- Neon PostgreSQL database
- Supabase project with a storage bucket
- Resend account (for verification emails)
- Khalti account (sandbox for testing)

### Frontend
```bash
cd D:\chess-app
npm install
npm run web              # or: npm run android | ios
```

### Backend
```bash
cd "D:\chess server\server"
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run dev              # http://localhost:3000
```

### Test data (sandbox payments)
```bash
cd "D:\chess server\server"
TEST_USER_EMAIL=you@example.com npx tsx prisma/seed-payment-test.ts
```
Then run the browser flow and optionally verify manually:
```
POST /orders              { productId, idempotencyKey }
POST /payments/khalti/initiate { orderId }
POST /payments/khalti/verify { pidx }
```
Verify in the DB: `Payment.status = SUCCEEDED`, `Order.status = PAID`, an entitlement row exists for the user + product.

---

## 10. Testing Payment Flow (Sandbox)

1. Configure `KHALTI_BASE_URL=https://dev.khalti.com/api/v2` and a sandbox secret key.
2. Seed a test product + pending order.
3. Create an order, then initiate Khalti checkout → the browser opens the sandbox payment page.
4. Complete payment in the Khalti sandbox → the return URL fires server-side verification.
5. Confirm in the app: the PDF is downloadable from the Library.

---

## 11. Deployment Notes

- **Frontend:** `npm run web` for static export; native builds via dev client (Android / iOS).
  CORS allow-list your app origin in production.
- **Backend:** `yarn build && yarn start` (Render example: `server-5-5h5o.onrender.com` in `.env.example`).
- `KHALTI_BASE_URL=https://khalti.com/api/v2` for live payments; whitelist `KHALTI_RETURN_URL` in the Khalti dashboard.
- The Supabase service-role key stays in the backend only — never expose it to the browser.

## 12. Security Considerations

| Area | Implementation |
|---|---|
| Passwords | Argon2 hashing |
| Tokens | JWT access + hashed refresh tokens with rotation |
| Secrets | `.env`, never committed |
| Payment | Server-side Khalti verification; client status untrusted |
| Amounts | Order amount matched against Khalti `total_amount` |
| PDF access | Entitlement-gated download (paid order, non-revoked entitlement) |
| Uploads | MIME + magic-byte validation, 20 MB limit |
| Idempotency | Orders keyed by `idempotencyKey`; duplicate-charge protection |

---

## 13. License

ISC — same as the backend project.

