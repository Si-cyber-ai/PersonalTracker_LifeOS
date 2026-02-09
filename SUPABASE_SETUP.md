# Supabase Setup Guide for LifeOS

This guide will walk you through setting up Supabase for your PersonalTracker LifeOS application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up with your GitHub account (recommended) or email

## Step 2: Create a New Project

1. Click "New Project"
2. Choose your organization
3. Fill in the project details:
   - **Name**: `lifeos-tracker` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Your Application

1. In your project folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and **run this complete SQL script** (all at once):

```sql
-- ============================================
-- COMPLETE DATABASE SETUP FOR LIFEOS
-- Copy and run this entire block in SQL Editor
-- (Safe to run multiple times - idempotent)
-- ============================================

-- 1. CREATE TABLES (IF NOT EXISTS)
-- =================================

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  linked_skill TEXT,
  linked_project TEXT,
  notes TEXT,
  checklist JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT false,
  color TEXT,
  is_subscription_event BOOLEAN DEFAULT false,
  linked_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  linked_projects TEXT[] DEFAULT '{}',
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  color_tag TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  completion INTEGER DEFAULT 0,
  linked_skills TEXT[] DEFAULT '{}',
  linked_goals TEXT[] DEFAULT '{}',
  tasks JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  focus_hours NUMERIC DEFAULT 0,
  projects_applied TEXT[] DEFAULT '{}',
  last_used TIMESTAMPTZ NOT NULL,
  work_types TEXT[] DEFAULT '{}',
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_name TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  billing_cycle TEXT NOT NULL,
  next_renewal TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY
-- =============================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES
-- =======================

-- Events Policies
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Goals Policies
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;

CREATE POLICY "Users can view their own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Projects Policies
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Skills Policies
DROP POLICY IF EXISTS "Users can view their own skills" ON skills;
DROP POLICY IF EXISTS "Users can insert their own skills" ON skills;
DROP POLICY IF EXISTS "Users can update their own skills" ON skills;
DROP POLICY IF EXISTS "Users can delete their own skills" ON skills;

CREATE POLICY "Users can view their own skills" ON skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- Expenses Policies
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

CREATE POLICY "Users can view their own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions Policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON subscriptions;

CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own subscriptions" ON subscriptions FOR DELETE USING (auth.uid() = user_id);

-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==================================

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
```

## Step 6: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase
2. Under **Email Auth**, ensure "Enable Email provider" is ON
3. (Optional) Configure email templates for signup confirmation
4. (Optional) Enable additional providers (Google, GitHub, etc.)

## Step 7: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth` and create a test account
3. Check your email for confirmation (if confirmation is enabled)
4. Try creating some data (events, goals, etc.)
5. Verify data appears in Supabase Dashboard → **Table Editor**

## Step 8: Deploy to Vercel

When deploying to Vercel, add your environment variables:

1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Redeploy your application

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env` file exists in your project root
- Restart your dev server after creating/updating `.env`
- Verify variable names start with `VITE_`

### Authentication Not Working
- Check if email confirmation is required in Supabase settings
- Verify RLS policies are created
- Check browser console for specific error messages

### Data Not Syncing
- Verify you're logged in (check navigation bar for email)
- Check Supabase Dashboard → **Table Editor** for data
- Open browser DevTools → Network tab to see API requests
- Check RLS policies are correctly set up

### Real-time Updates Not Working
- Verify Supabase Realtime is enabled (it is by default)
- Check that your subscription code is running
- Look for WebSocket connection in DevTools → Network → WS

### Subscriptions Not Saving (auto_renew column error)
If you set up your database before the auto_renew column was added, you need to run a migration:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `MIGRATION_ADD_AUTO_RENEW.sql`
4. Click "Run"
5. Refresh your app and try adding a subscription again

Alternatively, you can run this command in SQL Editor:
```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;
```

## Features Enabled

✅ **Authentication** - Secure user accounts with email/password  
✅ **Cloud Storage** - All data stored in PostgreSQL database  
✅ **Real-time Sync** - Changes sync automatically across devices  
✅ **Row Level Security** - Data is private to each user  
✅ **Demo Mode** - Works without login using sample data  

## Next Steps

- Add Google/GitHub OAuth for easier signup
- Set up email templates for better branding
- Add profile management page
- Implement data export/backup features
- Add team collaboration features

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in your repository

---

🎉 **Congratulations!** Your LifeOS app now has cloud sync enabled!
