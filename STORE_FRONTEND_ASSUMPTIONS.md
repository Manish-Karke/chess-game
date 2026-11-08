# Store Frontend — API Assumptions

The backend server is not present in this workspace, so the frontend store feature was
built against **DOCUMENTATION.md** (the backend spec). Endpoints and shapes that are
documented are implemented exactly as described. The following are assumptions that
should be confirmed against the running server (and adjusted in
`src/features/store/infrastructure/api/storeApi.ts` if they differ):

## Documented (implemented as specified)

- `POST /orders` body `{ productId, idempotencyKey }` -> `{ data: { orderId, productId, productTitle, amountMinor, amountNPR, currency, status, idempotencyKey, createdAt } }`
- `POST /payments/khalti/initiate` body `{ orderId }` -> `{ data: { orderId, paymentId, pidx, paymentUrl } }`
- `POST /payments/khalti/verify` body `{ pidx }` -> `{ data: { verified, status, orderId } }`
- `POST /products` (admin) body `{ title, slug, description, type, priceMinor, currency }`
- `POST /products/:id/pdf` (admin) multipart field `pdf`, max 20MB
- `GET /products/:id/pdf/download` (auth + entitlement) -> signed download URL
- `GET /products` / `GET /products/:id` -> published products

## Assumed (parser is defensive; verify against backend)

- `GET /products` -> `{ products: Product[], page, limit, total }` (also tolerates a bare array or `{ data: [...] }`)
- `GET /products/:id` -> `{ product: Product }` (also tolerates the product object at the root)
- `GET /entitlements` -> `{ entitlements: Entitlement[] }` — **not documented**, required for the Library screen (also tolerates bare array / `{ data }`)
- `GET /products/:id/pdf/download` -> `{ url }` (also tolerates `downloadUrl`, `signedUrl`, or a bare string)
- `POST /products` response -> `{ product: Product }` (also tolerates `{ data: { product } }`)

## Amounts

Prices are stored in minor units (paisa) on the server; the frontend displays `NPR` by dividing `priceMinor` / `amountMinor` by 100.

## Khalti on mobile

1. `POST /payments/khalti/initiate` returns `paymentUrl`.
2. The app opens `paymentUrl` in `expo-web-browser` (`WebBrowser.openBrowserAsync`).
3. The user completes payment on Khalti and returns to the app.
4. The app calls `POST /payments/khalti/verify` with the `pidx` (server-side verification — client status is never trusted).
5. On success the order is `PAID` and an entitlement is granted; the user can download the PDF from the Library.

## Admin file picker

`expo-document-picker` is not installed in this workspace, so the PDF upload screen
accepts a file URI manually. To enable native file picking, run:
`npx expo install expo-document-picker` and wire `DocumentPicker.getDocumentAsyncAsync`
into `useUploadPdfViewModel`.

## Base URL

`https://server-1-teud.onrender.com` (same as the existing auth/socket code). Consider
moving this to expo config env (`EXPO_PUBLIC_API_BASE_URL`) for multiple environments.
