# Joventra - The Modern Job Hunting Portal

Welcome to the **Joventra Client**! Joventra is a full-featured, highly scalable job hunting and recruitment platform built with a modern web stack. It bridges the gap between top talent (Seekers) and forward-thinking companies (Recruiters), providing an intuitive, transparent, and powerful platform for hiring.

## 🚀 Features

### For Seekers
* **Smart Job Discovery:** Search, filter, and discover jobs tailored to your skills.
* **One-Click Apply:** Upload your resume once and apply to multiple positions instantly.
* **Application Tracking:** Track the real-time status of your applications.
* **Beautiful Profiles:** Present your skills, experience, and portfolio in a professional dashboard.

### For Recruiters
* **Company Profiles:** Showcase your company's culture, perks, and open positions.
* **Applicant Tracking System (ATS):** Manage candidates effortlessly with Kanban-style status updates.
* **Premium Subscriptions (Stripe):** Upgrade to advanced tiers for unlimited job postings and featured listings.
* **Analytics:** View detailed metrics on job views, application rates, and hiring pipeline.

### For Administrators
* **User & Company Moderation:** Review and approve companies to maintain platform quality.
* **Revenue Tracking:** Monitor Stripe subscription payments and system health.
* **Comprehensive Analytics:** Oversee platform growth with detailed data visualizations.

## 💻 Tech Stack

* **Frontend:** React 18 (Vite), TypeScript, Tailwind CSS
* **Routing:** React Router v6
* **State Management:** Zustand (Auth), React Query (Server state)
* **UI Components:** Lucide React (Icons), Recharts (Data Visualization), Sonner (Toasts)
* **API Integration:** Axios

## 🛠️ Setup & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   cd Joventra
   npm install
   ```

2. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and fill in your keys:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🎨 Design Philosophy
Joventra prioritizes a clean, fluid, and highly responsive user experience. Leveraging fluid grid layouts, mobile drawer navigation, and accessible skeleton loading states, the platform is optimized for seamless interaction across all devices. 100% SEO optimized.

---
© Joventra Inc. Built for the future of work.
