# Hacker News Analytics Dashboard – Frontend

This README provides setup, run, and development instructions for the **frontend/** Next.js app.

---

## 📁 Project Structure

```
hacker-news-api-goodie/
├── backend/
└── frontend/
    ├── pages/
    ├── public/
    ├── styles/
    ├── utils/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.mjs
    └── README.md
```

---

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.local` if needed and set `NEXT_PUBLIC_API_BASE` (default: `http://localhost:8000/api`)

3. **Run the development server**
   ```bash
   npm run dev
   ```
   - App runs at [http://localhost:3000](http://localhost:3000)

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Environment Variables

- `.env.local` (example):
  ```ini
  NEXT_PUBLIC_API_BASE=http://localhost:8000/api
  ```
- This should match your backend API base URL.

---

## 🛠️ Tech Stack

- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts)
- **Axios** (API requests)

---

## 📦 Useful Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Start dev server           |
| `npm run build` | Build for production      |
| `npm start`   | Start production server    |
| `npm run lint`| Run ESLint                 |

---

## 🧩 Linting & Formatting

- ESLint is configured for Next.js and TypeScript.
- Run `npm run lint` to check code style.

---

## 🖌️ Styling

- Tailwind CSS is used for utility-first styling.
- Global styles: `styles/globals.css`

---

## 🔗 API Integration

- All API requests use the base URL from `NEXT_PUBLIC_API_BASE`.
- See `utils/api.ts` for Axios config.

---

## 📝 Notes

- Make sure the backend is running and accessible at the API base URL.
- For local development, run both backend and frontend servers.

---

Happy hacking! 🚀
