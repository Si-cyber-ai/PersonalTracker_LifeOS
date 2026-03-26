# LifeOS - Personal Life Management System

A comprehensive life tracking and management application built with modern web technologies. Track your goals, projects, skills, calendar events, expenses, and subscriptions all in one beautiful, intuitive interface.

![LifeOS Dashboard](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.95.3-green?logo=supabase)

## ✨ Features

### 🎯 Goals Tracking
- Create and manage personal and professional goals
- Track progress with visual indicators
- Set deadlines and priorities
- Mark goals as completed with achievement tracking

### 🚀 Project Management
- Organize projects with status tracking (Active, Paused, Completed)
- Link projects to your goals
- Track project progress and milestones

### 💡 Skills Development
- Manage your skills portfolio
- Track proficiency levels
- Monitor skill development over time

### 📅 Calendar & Events
- Schedule events and deep work sessions
- Track time spent on different activities
- View daily, weekly, and monthly schedules
- Color-coded event categories
- Deep work hour tracking

### 💰 Financial Management
- Track daily, weekly, and monthly expenses
- Categorize expenses for better insights
- Visualize spending patterns
- Monitor subscription costs

### 💳 Subscription Tracker
- Manage all your recurring subscriptions
- Track renewal dates and costs
- Get notified of upcoming renewals
- Monitor total subscription expenses

### 🎯 Focus Mode
- Distraction-free environment for deep work
- Full-screen immersive experience
- Timer and task tracking

### 🎨 Beautiful UI/UX
- Dynamic background with time-of-day theming
- Glass morphism design with smooth animations
- Fully responsive mobile-first design
- Dark mode support
- Intuitive navigation with wind effects

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Styling**: 
  - Tailwind CSS 3.4.17
  - shadcn/ui Components
  - Framer Motion for animations
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form + Zod validation
- **Date Management**: date-fns
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Si-cyber-ai/PersonalTracker_LifeOS.git
   cd PersonalTracker_LifeOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   
   Quick steps:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL migration scripts in the Supabase SQL Editor
   - Get your project URL and anon key

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🗂️ Project Structure

```
PersonalTracker_LifeOS/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components (Navigation, Cards)
│   │   ├── background/   # Dynamic background
│   │   └── logo/         # Branding components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── test/             # Test files
├── public/               # Static assets
└── ...config files
```

## 🔐 Authentication

LifeOS uses Supabase Authentication with support for:
- Email/Password authentication
- Email verification
- Password reset functionality
- Secure session management

## 💾 Database Schema

The application uses a PostgreSQL database with the following main tables:
- `profiles` - User profiles
- `goals` - User goals and objectives
- `projects` - Project management
- `skills` - Skills tracking
- `events` - Calendar events
- `expenses` - Financial transactions
- `subscriptions` - Recurring subscriptions

Detailed schema and setup instructions are available in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## 🎨 UI Components

Built with shadcn/ui components including:
- Cards, Buttons, Forms
- Dialogs, Alerts, Toasts
- Tables, Charts, Progress bars
- Calendar, Date pickers
- Dropdown menus, Tooltips
- And many more!

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License - feel free to use it for your personal projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

## 📧 Contact

Si-cyber-ai - [@Si-cyber-ai](https://github.com/Si-cyber-ai)
For questions or collaboration:
- Open an issue on GitHub
- Email: sidharthpnair20@example.com

Project Link: [https://github.com/Si-cyber-ai/PersonalTracker_LifeOS](https://github.com/Si-cyber-ai/PersonalTracker_LifeOS)

---

**Built with ❤️ using React, TypeScript, and Supabase by Sidharth**
