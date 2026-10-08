# DECORA Civil & Interiors — Backend REST API

Express 5 + MongoDB (Mongoose 9) REST API for the DECORA website. ESM throughout (`"type": "module"`).

## Setup

```bash
cp .env.example .env        # then edit values as needed
npm install
npm run seed                # creates admin user + sample content (DB must be reachable)
npm run dev                 # starts with --watch (http://localhost:5000)
```

- **MongoDB**: set `MONGO_URI` to a local instance (`mongodb://127.0.0.1:27017/decora`) **or** a MongoDB Atlas URI, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/decora`.
- The server starts even if the DB is unreachable (health endpoint will report `db: false`).

### Default admin credentials

| Field | Value |
| --- | --- |
| Email | `admin@decora.com` |
| Password | `Decora@2026` |

(Change these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding.)

## API Reference

All responses are JSON: `{ success, data, message? }`. Errors use the same shape with an appropriate HTTP status.

Auth = `Authorization: Bearer <token>` (from `POST /api/auth/login`).

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | — | Health check (`db` = connection state) |
| POST | `/api/auth/login` | — | Login → `{ token, user }` |
| GET | `/api/auth/me` | ✅ | Current user profile |
| GET | `/api/projects` | — | List projects (`?featured=true&category=X&search=q`) |
| GET | `/api/projects/:idOrSlug` | — | Single project by id or slug |
| POST | `/api/projects` | ✅ | Create project (JSON or multipart) |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/products` | — | List products (`?featured=true&category=X&search=q`) |
| GET | `/api/products/:idOrSlug` | — | Single product by id or slug |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |
| GET | `/api/clients` | — | List clients (`?search=`) |
| GET | `/api/clients/:id` | — | Single client |
| POST | `/api/clients` | ✅ | Create client (multipart: `logo`) |
| PUT | `/api/clients/:id` | ✅ | Update client |
| DELETE | `/api/clients/:id` | ✅ | Delete client |
| GET | `/api/testimonials` | — | List testimonials (`?featured=true&search=`) |
| GET | `/api/testimonials/:id` | — | Single testimonial |
| POST | `/api/testimonials` | ✅ | Create testimonial (multipart: `avatar`) |
| PUT | `/api/testimonials/:id` | ✅ | Update testimonial |
| DELETE | `/api/testimonials/:id` | ✅ | Delete testimonial |
| GET | `/api/services` | — | List services (`?search=`) |
| GET | `/api/services/:id` | — | Single service |
| POST | `/api/services` | ✅ | Create service |
| PUT | `/api/services/:id` | ✅ | Update service |
| DELETE | `/api/services/:id` | ✅ | Delete service |
| POST | `/api/messages` | — | Submit contact form (`name`, `email`, `message` required) |
| GET | `/api/messages` | ✅ | List messages (`?search=&status=new\|read\|archived`) |
| PATCH | `/api/messages/:id` | ✅ | Update message status |
| DELETE | `/api/messages/:id` | ✅ | Delete message |
| GET | `/api/settings` | — | Public site settings (singleton) |
| PUT | `/api/settings` | ✅ | Upsert site settings |
| GET | `/api/stats` | ✅ | Dashboard counts (projects, products, leads, …) |
| POST | `/api/uploads` | ✅ | Upload file (`file`) → `{ url }` |

## Notes

- **Files**: uploads are stored in `uploads/` and served at `/uploads/<filename>`. Accepted types: jpg, jpeg, png, webp, gif, svg, avif (8 MB max).
- **Multipart or JSON**: create/update endpoints accept both — uploaded files are merged into the body (`image`, `images`, `logo`, `avatar`, `cover`).
- **Errors**: 4xx errors throw `Error` with `statusCode`; everything flows through the central error handler.
