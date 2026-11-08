# ? Chess App

**Full-stack chess app with real-time play and a digital store.**

- ?? **Real-time chess** � local, vs computer, and online matchmaking over WebSockets (Socket.io)
- ?? **Digital store** � buy PDF & course products (Khalti payments), download PDFs with a paid entitlement, admin tools to publish products and upload PDFs
- ?? **Auth** � email verification, JWT access + rotating refresh tokens, session restore on app start

> This repository is the **frontend** (Expo / React Native). The backend lives in the sibling folder `D:\chess server\server` (Node.js + Express + Prisma + Neon + Supabase + Khalti).

---

## Quick start

### 1. Backend (chess server)

```bash
cd "D:\chess server\server"
npm install
cp .env.example .env          # Neon, Resend, JWT, Khalti (sandbox), Supabase keys
npx prisma migrate deploy
npx prisma generate
npm run dev                   # http://localhost:3000
```

### 2. Frontend (chess app)

```bash
cd D:\chess-app
npm install
npm run web                   # http://localhost:8081 (or expo start)
# or: npm run android | ios  # native builds
```

The app talks to the backend at `https://server-1-teud.onrender.com` (configurable in `src/shared/api/apiClient.ts`).

---

## Project structure

```
chess-app                            # this repo (Expo / React Native)
+-- app/                             # file-based routing (expo-router)
�   +-- (auth)/login.tsx, register.tsx, verify-email.tsx
�   +-- home.tsx                     # landing screen (games + Store menu item)
�   +-- game.tsx                     # local / computer / online game router
�   +-- store/                       # ?? BROWSE PRODUCTS (new)
�   +-- store/[id]/                  #   ?? PRODUCT DETAIL
�   +-- store/[id]/buy/              #   ?? BUY (Khalti checkout + verify)
�   +-- library.tsx                  #   ?? MY LIBRARY (paid PDFs)
�   +-- payment/success.tsx, failure.tsx   #   ?? PAYMENT RESULTS
�   +-- admin/products.tsx, create.tsx, [id]/upload   #   ?? ADMIN (sell)
�   +-- ...
+-- src/
�   +-- features/
�   �   +-- auth/                    # login / register / email verification / session
�   �   +-- chess/                   # real-time chess engine, sockets, UI
�   �   +-- store/                   # ?? domain-driven store feature (new)
�   �       +-- domain/{repositories,schemas,useCases}
�   �       +-- infrastructure/api/storeApi.ts   # HTTP client + defensive parsers
�   �       +-- di/storeFactory.ts
�   +-- shared/api/apiClient.ts      # base URL + auth headers + 401 retry
�   +-- app/                         # expo-router routes (root layout)
+-- ...
```

---

## Store / buy & sell features (new)

| Route                         | What it does                                                      |
| ----------------------------- | ----------------------------------------------------------------- |
| `/store`                      | Browse published PDF & course products (NPR pricing)              |
| `/store/[id]`                 | Product detail � Buy Now                                          |
| `/store/[id]/buy`             | Create order ? Khalti checkout ? **Verify Payment** ? entitlement |
| `/library`                    | Paid PDFs; one-tap download (Supabase signed URL, 120 s)          |
| `/admin/products`             | Admin product list                                                |
| `/admin/products/create`      | Create a draft product (PDF or Course)                            |
| `/admin/products/[id]/upload` | Upload the PDF file for a product                                 |

**Payment flow:** `POST /orders` ? `POST /payments/khalti/initiate` ? open `paymentUrl` ? `POST /payments/khalti/verify` (server-side) ? on success the entitlement is granted and the PDF unlocks.

---

## API contract (server)

### Auth

| Method | Path                 | Protected |
| ------ | -------------------- | --------- |
| POST   | `/auth/register`     | �         |
| POST   | `/auth/verify-email` | �         |
| POST   | `/auth/login`        | �         |
| POST   | `/auth/refresh`      | �         |
| POST   | `/auth/logout`       | �         |

### Store / payments

| Method | Path                            | Protected | Admin |
| ------ | ------------------------------- | --------- | ----- |
| GET    | `/products`                     | �         | �     |
| GET    | `/products/:id`                 | �         | �     |
| POST   | `/orders`                       | ?         | �     |
| POST   | `/payments/khalti/initiate`     | ?         | �     |
| POST   | `/payments/khalti/verify`       | ?         | �     |
| GET    | `/payments/khalti/return?pidx=` | �         | �     |
| POST   | `/products`                     | ?         | ?     |
| POST   | `/products/:id/pdf`             | ?         | ?     |
| GET    | `/products/:id/pdf/download`    | ?         | �     |

(Server auth uses a Bearer JWT; admin routes additionally require `role === "ADMIN"`.)

---

## API contract (server)

### Auth

| Method | Path                 | Protected |
| ------ | -------------------- | --------- |
| POST   | `/auth/register`     | �         |
| POST   | `/auth/verify-email` | �         |
| POST   | `/auth/login`        | �         |
| POST   | `/auth/refresh`      | �         |
| POST   | `/auth/logout`       | �         |

### Store / payments

| Method | Path                            | Protected | Admin |
| ------ | ------------------------------- | --------- | ----- |
| GET    | `/products`                     | �         | �     |
| GET    | `/products/:id`                 | �         | �     |
| POST   | `/orders`                       | ?         | �     |
| POST   | `/payments/khalti/initiate`     | ?         | �     |
| POST   | `/payments/khalti/verify`       | ?         | �     |
| GET    | `/payments/khalti/return?pidx=` | �         | �     |
| POST   | `/products`                     | ?         | ?     |
| POST   | `/products/:id/pdf`             | ?         | ?     |
| GET    | `/products/:id/pdf/download`    | ?         | �     |

(Server auth uses a Bearer JWT; admin routes additionally require `role === "ADMIN"`.)

---

## Environment variables

### Frontend

No `.env` is required at runtime. The backend base URL is configured in `src/shared/api/apiClient.ts` (`https://server-1-teud.onrender.com`). To support multiple environments, move it to `EXPO_PUBLIC_API_BASE_URL` in `app.json` or `env`.

### Backend (`D:\chess server\server`), copy `.env.example` ? `.env`

| Variable                                                               | Purpose                        |
| ---------------------------------------------------------------------- | ------------------------------ |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED`                                | Neon PostgreSQL                |
| `RESEND_API_KEY`, `EMAIL_FROM`                                         | Verification emails            |
| `JWT_SECRET`                                                           | Access + refresh token signing |
| `PORT`                                                                 | `3000`                         |
| `KHALTI_SECRET_KEY`, `KHALTI_BASE_URL`, `KHALTI_RETURN_URL`            | Khalti sandbox/live            |
| `APP_WEBSITE_URL`                                                      | Redirect target after payment  |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` | PDF storage                    |

> Never commit `.env` � it is gitignored.

---

## Development

```bash
npm run lint              # expo lint
npx tsc --noEmit          # frontend type check
cd "D:\chess server\server"
npx prisma migrate dev    # backend DB changes
```

## Deployment

- **Frontend:** `npm run web` (static export) or native dev clients (Android / iOS). CORS allow-list your app origin in production.
- **Backend:** `yarn build && yarn start` (Render example in `server/.env.example`).

---

## License

ISC � see the backend `LICENSE`.
