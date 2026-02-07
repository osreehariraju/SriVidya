# SriVidya Sadhana Tracker

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **Backend:** Supabase (Auth & Database)
- **Deployment:** Vercel

## Custom Auth Logic
Uses a "Username" system. The app automatically appends `@srividya.app` to the username 
to bypass email requirements. Email confirmation is disabled in Supabase.

## Database Schema
Table: `mantra_logs`
- `user_id`: UUID
- `mantra_name`: Text (శివా, గురు, etc.)
- `count_added`: Integer
- `created_at`: Timestamp