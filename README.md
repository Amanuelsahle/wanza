# 🛍️ Wanza

Wanza is a modern e-commerce web application built with **Next.js**, **MongoDB**, **Clerk authentication**, and **Stripe payments**. It includes a customer shopping experience, order tracking, and an admin dashboard for managing products and orders.

## ✨ Features

- 🛒 Browse products and view detailed product information
- 🧺 Add, update, and remove items from the cart
- 🔐 Secure sign-in and sign-up flow with Clerk
- 💳 Checkout and payment processing with Stripe
- 📦 Track user orders from the frontend
- 🛠️ Admin dashboard to manage inventory and view orders
- 📱 Responsive UI for desktop and mobile screens

## 🧰 Tech Stack

| Area               | Technology           |
| ------------------ | -------------------- |
| Framework          | Next.js              |
| UI                 | React + Tailwind CSS |
| Authentication     | Clerk                |
| Database           | MongoDB              |
| Payments           | Stripe               |
| Data visualization | Recharts             |

## 📁 Project Structure

```bash
app/                # App routes, pages, and API endpoints
components/         # Reusable UI components
context/            # Global app state and providers
lib/                # Database helpers, auth utilities, API clients
types/              # Shared TypeScript types
public/             # Static assets
```

## ⚙️ Environment Variables

Create a `.env.local` file and add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

MONGODB_URI=
MONGODB_DB=wanza

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ▶️ Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables in `.env.local`.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Scripts

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run start    # run the production build
npm run lint     # run ESLint checks
npm run seed     # seed database data
```

## 🗺️ Main Routes

- `/` — home page with featured products
- `/dashboard` — admin dashboard
- `/checkout` — checkout flow
- `/success` — successful payment page
- `/cancel` — cancelled payment page
- `/auth/sign-in` — sign-in page
- `/auth/sign-up` — sign-up page

## 📌 Notes

- The app uses MongoDB collections for products, carts, and orders.
- Stripe checkout is used for payment processing.
- Clerk handles authentication and role-based access for admin routes.
