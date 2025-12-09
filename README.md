# AgentHub - SaaS Dashboard

A complete multi-page SaaS dashboard for managing AI automation agents, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Authentication**: Simple UI-only login flow for demo purposes
- **Dashboard**: Overview with statistics and quick actions
- **User Management**: View and manage users with role-based access
- **Prompts**: Create, edit, and delete reusable prompts for agents
- **Agents**: Complete agent creation and configuration workflow
  - Multiple agent types (Widget, WhatsApp, Inbound, Outbound)
  - LLM model selection (GPT, Claude, Llama, Gemini)
  - Voice configuration
  - Widget customization (position, color, shape, messages)
  - Live preview functionality

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

1. The database is already configured with Supabase
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` and you'll be redirected to `/login`

## Authentication

This application uses a UI-only authentication flow for demo purposes:

1. Go to `/login`
2. Enter any valid email address (e.g., `demo@example.com`)
3. Enter any password (minimum 1 character)
4. Click "Sign In" to access the dashboard

No actual authentication is performed - the login is purely for UI demonstration.

## Project Structure

```
app/
  ├── login/              # Login page
  ├── dashboard/          # Dashboard layout and pages
  │   ├── layout.tsx      # Persistent sidebar layout
  │   ├── page.tsx        # Dashboard home
  │   ├── users/          # User management
  │   ├── prompts/        # Prompt management
  │   ├── agents/         # Agent management
  │   │   ├── create/     # Agent creation flow
  │   │   └── setup/      # Agent configuration
  │   └── settings/       # Settings page
components/
  ├── dashboard/          # Dashboard-specific components
  └── ui/                 # shadcn/ui components
lib/
  ├── supabase.ts         # Supabase client
  └── utils.ts            # Utility functions
types/
  └── database.ts         # TypeScript types
```

## Database Schema

- **profiles**: User profiles with roles and status
- **prompts**: Reusable prompts for agents
- **agents**: Agent configurations with types and settings
- **agent_widget_config**: Widget-specific configurations

All tables have Row Level Security (RLS) enabled for secure data access.
