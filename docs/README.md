# 📖 Project Documentation

This folder contains the documentation for the **Chess App** full-stack project:

| Document | What it covers |
|---|---|
| [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) | Full app documentation: architecture, domain model, Khalti store flow, API reference, environment setup, testing, deployment, security |
| [README.md](../README.md) | Quick start, project structure, store features, API contract, env, development |

## Repository layout

```
chess-app/                             # this repo (frontend, Expo / React Native)
├── app/                               # expo-router routes
├── src/features/
│   ├── auth/                          # login / register / email verification / session
│   ├── chess/                         # real-time chess engine, matchmaking, sockets
│   └── store/                         # 🧳 buy / sell store feature (domain-driven)
├── shared/api/apiClient.ts            # shared fetch client + auth
doc/                                   # project documentation (this folder)
├── README.md
└── PROJECT_DOCUMENTATION.md
```

The backend is in the sibling folder **`D:\chess server\server`** (Node.js + Express + Prisma + Neon + Supabase + Khalti). Its own documentation lives there at `DOCUMENTATION.md`; this folder complements it with the **frontend store/PDF/payment features** documented together with the backend contract.
