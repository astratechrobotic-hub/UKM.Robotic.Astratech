<<<<<<< HEAD
# UKM.Robotic.Astratech
 
=======
# Robotic Astratech Management System

A modern organizational management system built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI (Radix UI based)
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL & Auth)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project (for production)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes (protected)
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for auth
```

## Features

- **Landing Page:** Hero section with brand identity and divisions showcase
- **Authentication:** Login page with tech-themed design
- **Dashboard:** Overview with statistics and metrics
- **Members Management:** Table view of all organization members
- **Task Management:** Kanban-style task board organized by divisions

## Design System

The application uses a **Deep Maroon/Crimson** color scheme (`#800000`) with:
- Clean, engineered aesthetic
- High contrast for readability
- Minimal border radiuses
- Industrial tech theme

## Development

This project follows WorldSkills standards:
- Strict TypeScript typing
- Modular component architecture
- Server Components by default
- Client Components only when needed for interactivity

## License

Private - Robotic Astratech

>>>>>>> 1b18c3d (Inisialisasi awal)
