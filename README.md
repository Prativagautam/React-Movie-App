# React Movie App

A responsive movie and TV discovery application built with React, Vite, and the TMDB API. The app lets users browse popular content, search movies and series, filter by genre, view detailed media pages, read TMDB reviews, and save favorites locally.

## Live Demo

Deployed with Vercel.

https://react-movie-app-prativa1.vercel.app/

## Features

- Browse popular movies and TV series
- Search movies and TV series from TMDB
- Filter content by genre
- View detailed movie and TV pages
- Read TMDB reviews
- Add, edit, rate, and manage local user reviews
- Save and manage favorite content
- Local favorites search
- Responsive layout for desktop and mobile
- Client-side routing for movie and TV detail pages
- Vercel SPA rewrite support for direct URL refreshes

## Tech Stack

- React 19
- Vite 7
- React Router
- TanStack React Query
- Axios
- Tailwind CSS
- Lucide React
- TMDB API
- Vercel

## Project Structure

```txt
frontend/
  public/
  src/
    assets/
    components/
      auth/
      common/
      favorites/
      layout/
      movie/
    contexts/
    css/
    pages/
    services/
      api.js
    App.jsx
    main.jsx
  vercel.json
  package.json
  vite.config.js
```

## Getting Started

### Prerequisites

- Node.js
- npm
- TMDB API key

### Installation

Clone the repository:

```bash
git clone https://github.com/Prativagautam/React-Movie-App.git
cd React-Movie-App/frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_API_URL=https://api.themoviedb.org/3
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run tw:init` | Initialize Tailwind config files |

## Environment Variables

This project uses Vite environment variables.

| Variable | Description |
| --- | --- |
| `VITE_TMDB_API_KEY` | TMDB API key used for movie and TV requests |
| `VITE_TMDB_API_URL` | TMDB API base URL |

Vite exposes variables prefixed with `VITE_` to the client bundle. Do not store private server-side secrets in `VITE_` variables.

## Deployment

The app is deployed on Vercel as a Vite single-page application.

Recommended Vercel settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

The `vercel.json` file includes a rewrite rule so direct visits to client-side routes such as `/movie/:id`, `/tv/:id`, and `/favorites` resolve to the React app:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Development Workflow

1. Create or update a feature locally.
2. Run `npm run build` to verify the production build.
3. Commit the change.
4. Push to GitHub.
5. Vercel automatically creates a new deployment from the pushed branch.

## API Reference

Data is provided by [The Movie Database API](https://developer.themoviedb.org/docs/getting-started).

Main API service functions live in:

```txt
src/services/api.js
```

## Notes

- Favorites are managed on the client side through React context.
- Movie and TV routes are handled separately with `/movie/:id` and `/tv/:id`.
- The app uses Vercel rewrites to support refreshes on nested routes.
- If a TMDB key was ever committed to a public repository, rotate the key in your TMDB dashboard and update it in Vercel.

## Author

Built by [Prativa Gautam](https://github.com/Prativagautam).
