# ShopStream — India-focused E-commerce Demo (₹ Pricing)

A full-stack e-commerce project: browse products, filter and search, manage a
cart, check out with a simulated payment, track order history, and (as an
admin) manage the catalog, categories, and orders. Built with React +
Tailwind on the frontend and Node/Express + MongoDB on the backend, with JWT
auth and image uploads. All prices are shown in Indian Rupees (₹).

## Stack
- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Axios, react-hot-toast, lucide-react
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer, Cloudinary (optional)

## Key features
- 30 demo products across 7 categories (Smartphones, Laptops, Headphones, Home Appliances, Fashion, Bags, Watches), priced in ₹
- Homepage with hero, shop-by-category, featured/new/popular sections, and a promo banner
- Search, category filter, and price/rating sorting
- Cart with quantity update / remove
- Checkout: shipping + billing address, payment method (UPI / Credit Card / Debit Card / Cash on Delivery — simulated, no real gateway)
- Order history and password change under **My Account**
- Admin dashboard: add/edit/delete products, manage categories, view all orders and update their status

## Project structure
```
shopstream/
  backend/     -> Express API
  frontend/    -> React app (Vite)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works great — create a cluster, a database user, and copy the connection string).
- `JWT_SECRET` — any long random string.
- `CLOUDINARY_*` — optional. If left blank, uploaded product images are stored locally in `backend/uploads` and served from the API automatically — no Cloudinary account required to run the project.

Start the API:
```bash
npm run dev        # nodemon, auto-restarts on changes
# or
npm start
```
The API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`.

### (Optional) Seed demo data
```bash
npm run seed
```
This creates a demo admin account (`admin@shopstream.com` / `admin123`), 7
categories, and 30 sample products priced in ₹.

> Note: the **first user who ever registers** through the app is automatically
> promoted to `admin` — so you don't have to touch the database manually.

## 2. Frontend setup

Open a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The app runs at `http://localhost:5173` and is already configured (via Vite proxy
and `VITE_API_URL`) to talk to the backend at `http://localhost:5000`.

## 3. Using the app
1. Register an account at `/register` — the first account becomes an admin automatically (or use the seeded `admin@shopstream.com` / `admin123`).
2. As an admin, go to `/admin` to add, edit, and delete products (with image upload), manage categories, and view/update order statuses.
3. Browse, search, filter and sort products on the homepage — all prices shown in ₹.
4. Add items to your cart, adjust quantities, and go to **Checkout** to enter a shipping address, choose a payment method (UPI / Credit Card / Debit Card / Cash on Delivery), and place the order (simulated — no real payment gateway).
5. View past orders and change your password from **My Account**.

## API Reference

| Method | Endpoint                     | Access        | Description                  |
|--------|-------------------------------|---------------|-------------------------------|
| POST   | /api/auth/register            | Public        | Register a new user           |
| POST   | /api/auth/login               | Public        | Log in, get a JWT             |
| GET    | /api/auth/me                  | Private       | Get current user              |
| PUT    | /api/auth/password            | Private       | Change password               |
| GET    | /api/products                 | Public        | List products (search/filter/sort/paginate/featured) |
| GET    | /api/products/:id             | Public        | Get one product               |
| POST   | /api/products                 | Admin         | Create a product (multipart)  |
| PUT    | /api/products/:id             | Admin         | Update a product              |
| DELETE | /api/products/:id             | Admin         | Delete a product               |
| GET    | /api/categories                | Public        | List categories with product counts |
| POST   | /api/categories                | Admin         | Create a category             |
| DELETE | /api/categories/:id            | Admin         | Delete a category             |
| GET    | /api/cart                     | Private       | Get current user's cart       |
| POST   | /api/cart                     | Private       | Add item to cart              |
| PUT    | /api/cart/:productId          | Private       | Update item quantity          |
| DELETE | /api/cart/:productId          | Private       | Remove item from cart         |
| DELETE | /api/cart                     | Private       | Clear cart                    |
| POST   | /api/orders                    | Private       | Place an order from the current cart |
| GET    | /api/orders/myorders           | Private       | Get the logged-in user's order history |
| GET    | /api/orders/:id                 | Private       | Get a single order (owner or admin) |
| GET    | /api/orders                    | Admin         | List all orders               |
| PUT    | /api/orders/:id/status          | Admin         | Update an order's status      |

## Deployment
- **Backend:** Render / Railway — set the same environment variables from `.env.example` in your host's dashboard.
- **Frontend:** Netlify / Vercel — set `VITE_API_URL` to your deployed backend URL (e.g. `https://your-api.onrender.com/api`) and update `CLIENT_URL` in the backend `.env` to your deployed frontend URL for CORS.

## Notes
- Passwords are hashed with bcrypt; JWTs expire after 30 days by default.
- If Cloudinary credentials aren't provided, image uploads automatically fall back to local disk storage served from `/uploads`.
- All API errors return a consistent `{ success: false, message }` JSON shape.

## Troubleshooting

### "E11000 duplicate key error ... index: username_1 ... dup key: { username: null }" on register
This is **not** a bug in this project's code — the `User` model here has no `username`
field at all, only `name`/`email`/`password`. This error happens when your MongoDB
database already has a `users` collection left over from a *different* project
(e.g. an earlier tutorial) that created a unique index on a `username` field. Mongo
keeps that old index even though the new schema doesn't use it, so every new
document with no `username` collides with the first one.

Fix — pick one:
1. **Easiest:** in your `.env`, point `MONGO_URI` at a fresh database name, e.g.
   `.../shopstream_db?retryWrites=true&w=majority` (change `shopstream_db` to
   something new). A brand-new database has no leftover indexes.
2. **Or drop the bad index** on the existing database, using `mongosh` or MongoDB
   Compass:
   ```js
   use <your-db-name>
   db.users.dropIndex("username_1")
   ```
3. **Or wipe the collection** if it has no data you need:
   ```js
   use <your-db-name>
   db.users.drop()
   ```
Then restart the backend and try registering again.

### Buttons don't work / homepage is blank / no products showing
This happens when the frontend is calling the wrong backend port. If you run the
API on a port other than 5000 (this zip is already pre-configured for **5001**),
make sure all three of these agree:
- `backend/.env` → `PORT=5001`
- `frontend/vite.config.js` → both proxy `target` values → `http://localhost:5001`
- `frontend/.env` → `VITE_API_URL=http://localhost:5001/api`

Then restart **both** `npm run dev` processes (Vite doesn't always pick up `.env`
changes without a restart). Open the browser console / Network tab — a `net::ERR_CONNECTION_REFUSED`
or 404 on `/api/...` calls confirms a port mismatch.

### No products appear even after fixing the above
The database starts empty — nothing to show until you add products. Two options:
1. Register an account (the **first** account ever created becomes admin
   automatically) → go to `/admin` → **Add product**.
2. Or run the demo seeder to instantly populate 30 sample products (₹ pricing) across 7 categories and a demo
   admin login:
   ```bash
   cd backend
   npm run seed
   ```
